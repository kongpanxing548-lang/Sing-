#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-2.0-or-later
"""Collect exact third-party licence texts from the sources used by the build.

The component list is deliberately declarative and checked in.  This script
does not download licence boilerplate or infer a licence from a package name.
It copies bytes from the pinned source checkouts/archives already used by the
build, records their hashes, and fails closed when an expected source or notice
is missing.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = ROOT / "third_party/NOTICE_COMPONENTS.json"
DEFAULT_OUTPUT = ROOT / "build/legal"
LEGAL_PREFIXES = ("LICENSE", "LICENCE", "COPYING", "NOTICE", "COPYRIGHT")
PRUNED_DIRS = {
    ".git",
    ".svn",
    "__MACOSX",
    "_build",
    "_husk_build",
    "ANGLE.xcarchive",
    "DerivedData",
    "Package",
    "target",
}


def fail(message: str) -> "NoReturn":
    raise SystemExit(f"error: {message}")


def inside_repo(relative: str, field: str) -> Path:
    path = PurePosixPath(relative)
    if path.is_absolute() or ".." in path.parts:
        fail(f"{field} must be a repository-relative path: {relative!r}")
    resolved = (ROOT / Path(*path.parts)).resolve()
    try:
        resolved.relative_to(ROOT.resolve())
    except ValueError:
        fail(f"{field} escapes the repository: {relative!r}")
    return resolved


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def git_revision(git_root: Path, ref: str = "HEAD") -> str:
    try:
        return subprocess.run(
            ["git", "-C", str(git_root), "rev-parse", f"{ref}^{{commit}}"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()
    except (OSError, subprocess.CalledProcessError) as exc:
        fail(f"cannot resolve git revision {ref!r} in {git_root}: {exc}")


def validate_config(config: dict) -> list[dict]:
    if config.get("schema") != 1:
        fail("third-party notice manifest schema must be 1")
    components = config.get("components")
    if not isinstance(components, list) or not components:
        fail("third-party notice manifest has no components")
    seen: set[str] = set()
    for component in components:
        for field in ("id", "name", "source_url", "source_root", "distribution", "scan"):
            if not isinstance(component.get(field), str) or not component[field].strip():
                fail(f"component is missing non-empty {field!r}: {component!r}")
        component_id = component["id"]
        if component_id in seen:
            fail(f"duplicate component id: {component_id}")
        seen.add(component_id)
        if any(ch not in "abcdefghijklmnopqrstuvwxyz0123456789-" for ch in component_id):
            fail(f"unsafe component id: {component_id}")
        inside_repo(component["source_root"], f"{component_id}.source_root")
        for field in ("source_archive", "git_root", "source_pin_file"):
            if field in component:
                inside_repo(component[field], f"{component_id}.{field}")
        if component["scan"] not in ("recursive", "files"):
            fail(f"unsupported scan mode for {component_id}: {component['scan']}")
        if component["scan"] == "files" and not component.get("files"):
            fail(f"files scan for {component_id} has no files")
        for field in ("files", "required_files"):
            for relative in component.get(field, []):
                path = PurePosixPath(relative)
                if path.is_absolute() or ".." in path.parts:
                    fail(f"unsafe {field} path for {component_id}: {relative!r}")
    return components


def legal_files(root: Path, component: dict) -> list[Path]:
    if component["scan"] == "files":
        selected = [root / Path(*PurePosixPath(item).parts) for item in component["files"]]
    else:
        selected = []
        for current, directories, filenames in os.walk(root, followlinks=False):
            directories[:] = sorted(
                directory for directory in directories if directory not in PRUNED_DIRS
            )
            for filename in sorted(filenames):
                if filename.upper().startswith(LEGAL_PREFIXES):
                    selected.append(Path(current) / filename)
        for relative in component.get("required_files", []):
            candidate = root / Path(*PurePosixPath(relative).parts)
            if candidate not in selected:
                selected.append(candidate)
    unique = sorted(set(selected), key=lambda item: item.relative_to(root).as_posix())
    for path in unique:
        if not path.is_file():
            fail(f"required notice is missing for {component['id']}: {path}")
    if not unique:
        fail(f"no licence or notice files found for {component['id']} in {root}")
    return unique


def verify_source(component: dict, root: Path) -> tuple[str, dict | None]:
    if not root.is_dir():
        fail(f"source tree is missing for {component['id']}: {root}")

    source_pin = component.get("source_pin", "")
    pin_file_value = None
    if "source_pin_file" in component:
        pin_file = inside_repo(component["source_pin_file"], f"{component['id']}.source_pin_file")
        if not pin_file.is_file():
            fail(f"source pin file is missing for {component['id']}: {pin_file}")
        pin_file_value = pin_file.read_text(encoding="utf-8").strip()
        if not pin_file_value:
            fail(f"source pin file is empty for {component['id']}: {pin_file}")
        source_pin = pin_file_value

    git_record = None
    if "git_root" in component:
        git_root = inside_repo(component["git_root"], f"{component['id']}.git_root")
        actual = git_revision(git_root)
        expected = component.get("git_commit") or pin_file_value
        if "git_ref" in component:
            expected = git_revision(git_root, component["git_ref"])
            source_pin = component["git_ref"]
        if expected and actual != expected:
            fail(
                f"source revision mismatch for {component['id']}: "
                f"expected {expected}, found {actual}"
            )
        git_record = {"head": actual}

    archive_record = None
    if "source_archive" in component:
        archive = inside_repo(component["source_archive"], f"{component['id']}.source_archive")
        if not archive.is_file():
            fail(f"source archive is missing for {component['id']}: {archive}")
        archive_record = {
            "path": archive.relative_to(ROOT).as_posix(),
            "sha256": sha256(archive),
            "size": archive.stat().st_size,
        }

    verification = None
    if git_record is not None or archive_record is not None:
        verification = {}
        if git_record is not None:
            verification["git"] = git_record
        if archive_record is not None:
            verification["archive"] = archive_record
    return source_pin, verification


def generate(config_path: Path, output: Path) -> None:
    config = json.loads(config_path.read_text(encoding="utf-8"))
    components = validate_config(config)

    output = output.resolve()
    build_root = (ROOT / "build").resolve()
    try:
        output.relative_to(build_root)
    except ValueError:
        fail(f"output must stay inside {build_root}: {output}")
    if output.exists():
        shutil.rmtree(output)
    licences_root = output / "licenses"
    licences_root.mkdir(parents=True)

    aggregate = bytearray(
        b"DroidDeck third-party notices\n"
        b"================================\n\n"
        b"Generated by scripts/generate_third_party_notices.py from the exact "
        b"source inputs listed in third_party/NOTICE_COMPONENTS.json. Licence "
        b"bytes between BEGIN/END markers are copied without rewriting.\n\n"
    )
    manifest_components = []
    for component in components:
        source_root = inside_repo(component["source_root"], f"{component['id']}.source_root")
        source_pin, verification = verify_source(component, source_root)
        files = legal_files(source_root, component)
        output_files = []
        for source in files:
            relative = source.relative_to(source_root)
            destination = licences_root / component["id"] / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)
            raw = source.read_bytes()
            source_label = relative.as_posix()
            aggregate.extend(
                (
                    f"{'=' * 78}\n"
                    f"{component['name']} ({component.get('version', source_pin)})\n"
                    f"Source: {component['source_url']}\n"
                    f"Pin: {source_pin}\n"
                    f"Distributed as: {component['distribution']}\n"
                    f"BEGIN ORIGINAL FILE: {source_label}\n"
                    f"{'-' * 78}\n"
                ).encode("utf-8")
            )
            aggregate.extend(raw)
            if raw and not raw.endswith(b"\n"):
                aggregate.extend(b"\n")
            aggregate.extend(
                (f"{'-' * 78}\nEND ORIGINAL FILE: {source_label}\n\n").encode("utf-8")
            )
            output_files.append(
                {
                    "source_path": source.relative_to(ROOT).as_posix(),
                    "distributed_path": destination.relative_to(output).as_posix(),
                    "sha256": hashlib.sha256(raw).hexdigest(),
                    "size": len(raw),
                }
            )
        record = {
            "id": component["id"],
            "name": component["name"],
            "version": component.get("version", source_pin),
            "source_url": component["source_url"],
            "source_pin": source_pin,
            "distribution": component["distribution"],
            "license_files": output_files,
        }
        if verification is not None:
            record["source_verification"] = verification
        manifest_components.append(record)

    notices = output / "THIRD_PARTY_NOTICES.txt"
    notices.write_bytes(bytes(aggregate))
    manifest = {
        "schema": 1,
        "generator": "scripts/generate_third_party_notices.py",
        "configuration": config_path.relative_to(ROOT).as_posix(),
        "notices_sha256": sha256(notices),
        "components": manifest_components,
    }
    (output / "THIRD_PARTY_NOTICES.manifest.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(
        f"{len(manifest_components)} components, "
        f"{sum(len(item['license_files']) for item in manifest_components)} files -> {output}"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--check-config",
        action="store_true",
        help="validate the checked-in manifest without requiring downloaded sources",
    )
    args = parser.parse_args()
    config_path = args.config.resolve()
    config = json.loads(config_path.read_text(encoding="utf-8"))
    components = validate_config(config)
    if args.check_config:
        print(f"PASS: {len(components)} third-party notice components are configured")
        return
    generate(config_path, args.output_dir)


if __name__ == "__main__":
    main()
