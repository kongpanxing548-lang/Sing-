#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-2.0-or-later
"""Write the licence notices of a Rust package's shipped dependency graph.

Uses ``cargo tree`` with the selected lockfile and iOS target to walk normal
(non-build, non-dev, non-proc-macro) dependencies, then copies each package's
original LICENSE/COPYING/NOTICE files from the Cargo source cache.  By default
this inventories libhusk_rppairing.a; ``--manifest-path`` and ``--package``
also let clean CI inventory the idevice-ffi archive inside StikJIT.
"""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

here = Path(__file__).resolve().parent


def command_output(command: list[str], cwd: Path) -> str:
    return subprocess.run(
        command, cwd=cwd, check=True, capture_output=True, text=True
    ).stdout


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('output', type=Path)
    parser.add_argument('--manifest-path', type=Path, default=here / 'Cargo.toml')
    parser.add_argument('--package', help='workspace package whose runtime graph is distributed')
    parser.add_argument(
        '--label',
        default='libhusk_rppairing.a (src/rppairing-ios)',
        help='human-readable binary/component label in the generated notice',
    )
    parser.add_argument('--target', default='aarch64-apple-ios')
    parser.add_argument(
        '--features',
        help='comma/space-separated Cargo features enabled in addition to defaults',
    )
    args = parser.parse_args()

    manifest = args.manifest_path.resolve()
    if not manifest.is_file():
        raise SystemExit(f'manifest does not exist: {manifest}')
    feature_args = ['--features', args.features] if args.features else []
    metadata = json.loads(command_output([
        'cargo', 'metadata', '--format-version', '1', '--locked',
        '--filter-platform', args.target, '--manifest-path', str(manifest),
        *feature_args,
    ], manifest.parent))
    packages = metadata['packages']
    metadata_workspace = Path(metadata['workspace_root'])
    actual_workspace = metadata_workspace
    if not actual_workspace.is_dir():
        # Native Cargo preserves Unicode paths on Windows, while an MSYS shell
        # can hand a native Python executable an ANSI-decoded argv path. Map
        # path dependencies back to the manifest's existing workspace in that
        # environment; registry package paths are unaffected.
        actual_workspace = next(
            (
                parent for parent in (manifest.parent, *manifest.parents)
                if parent.name == metadata_workspace.name
                and (parent / 'Cargo.toml').is_file()
            ),
            metadata_workspace,
        )
    lockfile = actual_workspace / 'Cargo.lock'
    if not lockfile.is_file():
        raise SystemExit(f'Cargo.lock is missing for {manifest}: {lockfile}')
    lock_sha256 = hashlib.sha256(lockfile.read_bytes()).hexdigest()

    if args.package:
        roots = [package for package in packages if package['name'] == args.package]
        if len(roots) != 1:
            raise SystemExit(
                f'expected one package named {args.package!r}, found {len(roots)}'
            )
        root_package = roots[0]
    else:
        root_id = metadata['resolve']['root']
        roots = [package for package in packages if package['id'] == root_id]
        if len(roots) != 1:
            raise SystemExit(f'cannot identify Cargo root package for {manifest}')
        root_package = roots[0]

    # cargo metadata describes the entire workspace and can unify features from
    # tools/tests that are not linked into the selected binary. cargo tree -p
    # gives the exact normal dependency graph for just the distributed package.
    tree = command_output([
        'cargo', 'tree', '--manifest-path', str(manifest), '--locked',
        '--target', args.target, '--package', root_package['name'],
        '--edges', 'normal,no-proc-macro', '--prefix', 'none', '--format', '{p}',
        *feature_args,
    ], manifest.parent)
    selected: set[tuple[str, str]] = set()
    for line in tree.splitlines():
        display = line.removesuffix(' (*)').strip()
        match = re.match(r'^(\S+) v(\S+)(?:\s|$)', display)
        if not match:
            raise SystemExit(f'cannot parse cargo tree package: {line!r}')
        selected.add((match.group(1), match.group(2)))
    selected.discard((root_package['name'], root_package['version']))

    packages_by_key: dict[tuple[str, str], list[dict]] = {}
    for package in packages:
        packages_by_key.setdefault((package['name'], package['version']), []).append(package)
    shipped = []
    for key in sorted(selected):
        matches = packages_by_key.get(key, [])
        if len(matches) != 1:
            raise SystemExit(
                f'cargo package {key[0]} {key[1]} maps to {len(matches)} metadata entries'
            )
        shipped.append(matches[0])

    out = [f'Third-party notices for {args.label}, generated',
           'by src/rppairing-ios/notices.py from the selected package Cargo.lock.',
           f'Cargo.lock SHA-256: {lock_sha256}',
           f'Additional Cargo features: {args.features or "none (package defaults only)"}.',
           'Only normal aarch64-apple-ios dependencies are included; build, dev, and',
           'proc-macro packages are not linked into the distributed binary. Each crate',
           'is listed with its declared licence and original notice files.', '']
    missing, seen = [], {}
    for package in shipped:
        folder = Path(package['manifest_path']).parent
        if not folder.is_dir():
            try:
                relative = folder.relative_to(metadata_workspace)
            except ValueError:
                pass
            else:
                folder = actual_workspace / relative
        if not folder.is_dir():
            raise SystemExit(
                f"package source directory is missing for {package['name']}: {folder}"
            )
        files = sorted(f for f in folder.iterdir()
                       if f.is_file() and f.name.upper().startswith(
                           ('LICENSE', 'LICENCE', 'COPYING', 'NOTICE')))
        out.append('=' * 78)
        out.append(
            f"{package['name']} {package['version']} "
            f"({package.get('license') or 'see files'})"
        )
        if package.get('repository'):
            out.append(package['repository'])
        if not files:
            missing.append(package['name'])
            out.append('(no licence file in the published crate; licence as declared above)')
        for notice in files:
            # The aggregate is UTF-8 documentation rather than a byte-for-byte
            # archive (the top-level notice generator handles exact copies).
            # Normalize only line endings/trailing whitespace so the checked-in
            # generated file passes repository whitespace checks deterministically.
            text = '\n'.join(
                line.rstrip()
                for line in notice.read_text(encoding='utf-8', errors='replace').splitlines()
            ).rstrip()
            if text in seen:
                out.append(f'--- {notice.name}: same text as {seen[text]} above ---')
            else:
                seen[text] = f"{package['name']} {notice.name}"
                out += ['', f'--- {notice.name} ---', text]
        out.append('')

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        '\n'.join(out).rstrip('\n') + '\n', encoding='utf-8', newline='\n'
    )
    suffix = f" (no licence file: {', '.join(missing)})" if missing else ''
    print(f'{len(shipped)} crates -> {args.output}{suffix}')


if __name__ == '__main__':
    main()
