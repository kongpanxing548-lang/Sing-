#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-2.0-or-later
"""Fast, cross-platform checks for DroidDeck's distributable identity."""

from __future__ import annotations

import hashlib
import json
import plistlib
import re
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.1.1"
BUILD = "2"
BUNDLE_ID = "com.droiddeck.app"
ARTIFACT_NAME = f"DroidDeck-{VERSION}"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"FAIL: {message}")


def load_plist(relative: str) -> dict:
    with (ROOT / relative).open("rb") as handle:
        return plistlib.load(handle)


def png_size(relative: str) -> tuple[int, int]:
    data = (ROOT / relative).read_bytes()
    require(data[:8] == b"\x89PNG\r\n\x1a\n", f"{relative} is not a PNG")
    return struct.unpack(">II", data[16:24])


def png_has_alpha(relative: str) -> bool:
    data = (ROOT / relative).read_bytes()
    # PNG colour types 4 and 6 carry an alpha channel; indexed PNGs can add
    # transparency through a tRNS chunk. App Store icons must contain neither.
    return data[25] in (4, 6) or b"tRNS" in data


def sha256(relative: str) -> str:
    return hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()


def load_strings(relative: str) -> dict[str, str]:
    """Load a simple UTF-8 .strings resource and reject malformed entries.

    These files are intentionally plain key/value resources rather than an
    Xcode-only asset: checking them here catches a missing Chinese UI before a
    several-hour macOS build begins.
    """
    path = ROOT / relative
    require(path.is_file(), f"missing localization resource: {relative}")
    try:
        source = path.read_text(encoding="utf-8-sig")
    except UnicodeDecodeError as error:
        raise SystemExit(f"FAIL: {relative} must be UTF-8: {error}") from error

    entry = re.compile(r'^\s*"((?:\\.|[^"\\])*)"\s*=\s*"((?:\\.|[^"\\])*)"\s*;\s*$')
    pairs: list[tuple[str, str]] = []
    in_comment = False
    for line_number, line in enumerate(source.splitlines(), 1):
        stripped = line.strip()
        if in_comment:
            if "*/" in stripped:
                in_comment = False
            continue
        if not stripped or stripped.startswith("//"):
            continue
        if stripped.startswith("/*"):
            in_comment = "*/" not in stripped
            continue
        match = entry.fullmatch(line)
        require(match is not None, f"{relative}:{line_number} malformed .strings entry")
        pairs.append((match.group(1), match.group(2)))

    require(pairs, f"{relative} must contain .strings key/value pairs")
    keys = [key for key, _ in pairs]
    require(len(keys) == len(set(keys)), f"{relative} contains duplicate keys")

    # A translated format string must accept exactly the arguments supplied by
    # its English source key. A mismatch otherwise crashes String(format:) at
    # runtime or prints the wrong value in Chinese.
    placeholder = re.compile(
        r'%(?!%)(?:\d+\$)?(?:[-+0 #]*\d*(?:\.\d+)?)?(?:hh|h|ll|l|q|z|t|j)?[@diuoxXfFeEgGaAcCsSp]'
    )
    for key, value in pairs:
        require(
            placeholder.findall(key) == placeholder.findall(value),
            f"{relative} format placeholders for {key!r}",
        )
    return dict(pairs)


def require_strings(relative: str, expected: dict[str, str]) -> None:
    strings = load_strings(relative)
    for key, value in expected.items():
        require(strings.get(key) == value, f"{relative} translation for {key!r}")


main = load_plist("src/app/Husk/Info.plist")
helper = load_plist("src/app/HuskJITHelper/Info.plist")
widget = load_plist("src/app/HuskDownloadsWidget/Info.plist")

require(main["CFBundleDisplayName"] == "DroidDeck", "main display name")
require(main["CFBundleShortVersionString"] == VERSION, "main marketing version")
require(main["CFBundleVersion"] == BUILD, "main build number")
require(main["CFBundleURLTypes"][0]["CFBundleURLSchemes"] == ["droiddeck"], "URL scheme")
require(
    all(item.get("CFBundleTypeName") != "PS4 Package" for item in main["CFBundleDocumentTypes"]),
    "PS4 package association must stay disabled without its runtime",
)

for label, plist in (("JIT helper", helper), ("downloads widget", widget)):
    require(plist["CFBundleShortVersionString"] == VERSION, f"{label} marketing version")
    require(plist["CFBundleVersion"] == BUILD, f"{label} build number")

project = (ROOT / "src/app/project.yml").read_text(encoding="utf-8")
pbxproj = (ROOT / "src/app/Husk.xcodeproj/project.pbxproj").read_text(encoding="utf-8")
require(f"HUSK_BUNDLE_IDENTIFIER: {BUNDLE_ID}" in project, "project.yml bundle ID")
require("developmentLanguage: en" in project, "project.yml development language")
require(
    'path: HuskJITHelper/Resources\n        buildPhase: resources' in project,
    "JIT helper localization resources must be bundled",
)
require(
    'path: HuskDownloadsWidget/Resources\n        buildPhase: resources' in project,
    "downloads widget localization resources must be bundled",
)
require(f"HUSK_BUNDLE_IDENTIFIER = {BUNDLE_ID};" in pbxproj, "checked-in project bundle ID")
require("ASSETCATALOG_COMPILER_APPICON_NAME: DroidDeckIcon" in project, "XcodeGen icon")
require("ASSETCATALOG_COMPILER_APPICON_NAME = DroidDeckIcon;" in pbxproj, "Xcode icon")
require("ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS: NO" in project, "exclude upstream alternate icons")
require("ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS = NO;" in pbxproj, "checked-in project excludes upstream alternate icons")
require("droiddeck-icon.png in Resources" in pbxproj, "checked-in project bundles the DroidDeck icon preview")
require(
    "- framework: ../../build/ios-arm64/lib/libhuskps4.dylib" not in project,
    "unpublished PS4 runtime must stay optional",
)
require("libhuskps4.dylib" not in pbxproj, "checked-in project must not require PS4 runtime")
require("libFilePickerFix.dylib" not in project, "unverifiable file-picker binary must not be linked")
require("libFilePickerFix.dylib" not in pbxproj, "checked-in project must not link file-picker binary")
require(
    not (ROOT / "src/app/Frameworks/libFilePickerFix.dylib").exists(),
    "unverifiable file-picker binary must not be distributed",
)
require(
    sha256("src/app/Frameworks/StikJIT.xcframework/ios-arm64/StikJIT.framework/StikJIT")
    == "f15ad5c6766fa07d545be283c1c99eccde6a8baa97d73978a09ec080ca6381df",
    "vendored StikJIT 1.9.0 binary checksum",
)
file_picker = (ROOT / "src/app/Husk/HuskFilePicker.swift").read_text(encoding="utf-8")
require("asCopy: true" in file_picker, "system file picker must import copies without the removed tweak")
require("vmlinuz-virt" not in project and "initramfs-virt" not in project, "project must not bundle Alpine guest binaries")
require("vmlinuz-virt" not in pbxproj and "initramfs-virt" not in pbxproj, "checked-in project must not bundle Alpine guest binaries")

contents_path = ROOT / "src/app/Husk/Assets.xcassets/DroidDeckIcon.appiconset/Contents.json"
contents = json.loads(contents_path.read_text(encoding="utf-8"))
require(contents["images"][0]["filename"] == "Icon-Default.png", "icon catalog filename")
require(
    png_size("src/app/Husk/Assets.xcassets/DroidDeckIcon.appiconset/Icon-Default.png") == (1024, 1024),
    "app icon must be 1024x1024",
)
require(
    not png_has_alpha("src/app/Husk/Assets.xcassets/DroidDeckIcon.appiconset/Icon-Default.png"),
    "app icon must not contain transparency",
)
require(
    png_size("src/app/Husk/Resources/droiddeck-icon.png") == (1024, 1024),
    "bundled DroidDeck icon preview must be 1024x1024",
)
legacy_icon_paths = [
    "src/app/Husk/Assets.xcassets/AppIcon.appiconset",
    "src/app/Husk/Assets.xcassets/AppIconClearDark.appiconset",
    "src/app/Husk/Assets.xcassets/AppIconClearLight.appiconset",
    "src/app/Husk/Assets.xcassets/AppIconTintedDark.appiconset",
    "src/app/Husk/Assets.xcassets/AppIconTintedLight.appiconset",
    "src/app/Husk/Resources/icon-cleardark.png",
    "src/app/Husk/Resources/icon-clearlight.png",
    "src/app/Husk/Resources/icon-dark.png",
    "src/app/Husk/Resources/icon-default.png",
    "src/app/Husk/Resources/icon-tinteddark.png",
    "src/app/Husk/Resources/icon-tintedlight.png",
]
require(not any((ROOT / path).exists() for path in legacy_icon_paths), "upstream Husk icon assets must not ship")
require(
    not any(Path(path).name in pbxproj for path in legacy_icon_paths),
    "checked-in project must not reference upstream Husk icon assets",
)
require(
    not (ROOT / "altsource.json").exists(),
    "an upstream AltStore feed must not be published as DroidDeck",
)
catalog = json.loads((ROOT / "catalog/source.json").read_text(encoding="utf-8"))
require(
    catalog["name"] == "DroidDeck Essentials"
    and catalog["identifier"] == "com.droiddeck.essentials",
    "Android catalog identity",
)

app_clip = (ROOT / "src/app/Husk/AppClip.swift").read_text(encoding="utf-8")
require('static let scheme = "droiddeck"' in app_clip, "App Clip URL scheme")
jit_setup = (ROOT / "src/app/Husk/JITSetup.swift").read_text(encoding="utf-8")
require(
    'localdevvpn://enable?scheme=droiddeck' in jit_setup and "scheme=husk" not in jit_setup,
    "LocalDevVPN return URL scheme",
)
package_script = (ROOT / "scripts/package_ipa.sh").read_text(encoding="utf-8")
require(
    "plutil -replace HuskBuildCommit" in package_script
    and "plutil -insert HuskBuildCommit" in package_script,
    "build stamp must handle both a clean and an already-stamped plist",
)
require(
    "status --porcelain --untracked-files=normal" in package_script,
    "standalone build stamp must detect untracked inputs",
)
require("DroidDeckSourceURL" in package_script, "corresponding source URL stamp")
settings = (ROOT / "src/app/Husk/SettingsTab.swift").read_text(encoding="utf-8")
require("droidDeckSourceURL" in settings, "About page corresponding source link")
workflow = (ROOT / ".github/workflows/build-ipa.yml").read_text(encoding="utf-8")
require("DROIDDECK_SOURCE_URL:" in workflow, "workflow source URL")
require("- DroidDeck" in workflow, "DroidDeck branch push build trigger")
require(f"name: {ARTIFACT_NAME}" in workflow, "workflow artifact version")
require(f"DroidDeck {VERSION}" in (ROOT / "README.md").read_text(encoding="utf-8"), "README version")
require(f"# DroidDeck {VERSION}" in (ROOT / "DROIDDECK.md").read_text(encoding="utf-8"), "DroidDeck guide version")
whats_new = (ROOT / "src/app/Husk/WhatsNew.swift").read_text(encoding="utf-8")
require(f'static let version = "{VERSION}"' in whats_new, "What’s New version")

require_strings(
    "src/app/Husk/Resources/zh-Hans.lproj/Localizable.strings",
    {
        "Home": "首页",
        "Library": "应用库",
        "Store": "商店",
        "Settings": "设置",
        "JIT is off": "JIT 未开启",
        "Turn On": "开启",
        "Add your first game": "添加你的第一个游戏",
    },
)
require_strings(
    "src/app/Husk/Resources/zh-Hans.lproj/InfoPlist.strings",
    {
        "CFBundleDisplayName": "DroidDeck",
        "CFBundleTypeName": "Android 应用",
        "NSLocalNetworkUsageDescription": "DroidDeck 使用本地网络与这台 iPhone 配对并启用 JIT，无需电脑。",
    },
)
require_strings(
    "src/app/HuskJITHelper/Resources/zh-Hans.lproj/InfoPlist.strings",
    {"CFBundleDisplayName": "DroidDeck JIT 助手"},
)
require_strings(
    "src/app/HuskDownloadsWidget/Resources/zh-Hans.lproj/InfoPlist.strings",
    {"CFBundleDisplayName": "DroidDeck 下载"},
)

# Every explicit L10n key and every fixed SwiftUI title must exist in the main
# table. This catches a new English-only screen before the IPA is built.
main_strings = load_strings("src/app/Husk/Resources/zh-Hans.lproj/Localizable.strings")
l10n_call = re.compile(r'L10n\.(?:text|format)\("((?:\\.|[^"\\])*)"')
ui_call = re.compile(
    r'(?:Text|Button|Label|Section|navigationTitle|ProgressView|Toggle|Picker|accessibilityLabel|confirmationDialog|alert)'
    r'\(\s*"((?:\\.|[^"\\])*)"'
)
for swift_path in (ROOT / "src/app/Husk").rglob("*.swift"):
    swift = swift_path.read_text(encoding="utf-8")
    for key in l10n_call.findall(swift):
        require(key in main_strings, f"missing zh-Hans L10n key {key!r} ({swift_path.name})")
    for key in ui_call.findall(swift):
        if key and r"\(" not in key:
            require(key in main_strings, f"missing zh-Hans UI key {key!r} ({swift_path.name})")

widget_strings = load_strings(
    "src/app/HuskDownloadsWidget/Resources/zh-Hans.lproj/Localizable.strings"
)
for swift_path in (ROOT / "src/app/HuskDownloadsWidget").rglob("*.swift"):
    swift = swift_path.read_text(encoding="utf-8")
    for key in l10n_call.findall(swift):
        require(key in widget_strings, f"missing widget zh-Hans key {key!r}")
qemu_runner = (ROOT / "src/app/Husk/QemuRunner.swift").read_text(encoding="utf-8")
require("phase0Alpine" not in qemu_runner, "GPL Phase 0 guest must not be bundled")
require("virtio-net-pci,netdev=net0,romfile=" in qemu_runner, "QEMU network option ROM must be disabled")
require('"-L", "\\(Bundle.main.bundlePath)/pc-bios"' not in qemu_runner, "QEMU must not search bundled option ROMs")
require('cp "$BIOS"/efi-*.rom' not in project, "GPL iPXE EFI ROMs must not be bundled")
require('cp \\"$BIOS\\"/efi-*.rom' not in pbxproj, "checked-in project must not bundle GPL iPXE ROMs")
require('cp "$BIOS"/pxe-*.rom' not in project, "GPL iPXE PXE ROMs must not be bundled")
require('cp \\"$BIOS\\"/pxe-*.rom' not in pbxproj, "checked-in project must not bundle GPL iPXE PXE ROMs")
console_ui = (ROOT / "src/app/Husk/ConsoleUI.swift").read_text(encoding="utf-8")
require(
    "static let allCases: [PlatformFilter] = [.all, .android]" in console_ui,
    "Android-only build must not advertise a PS4 platform filter",
)
translation_layer = (ROOT / "src/app/Husk/TranslationLayer.swift").read_text(encoding="utf-8")
require("hasBundledJavaRuntime" in translation_layer, "optional Java runtime fallback")
angle_script = (ROOT / "scripts/build_angle_ios.sh").read_text(encoding="utf-8")
require("WEBKIT_COMMIT=" in angle_script, "ANGLE source must be pinned")
sources_script = (ROOT / "scripts/sources.sh").read_text(encoding="utf-8")
fetch_script = (ROOT / "scripts/fetch_sources.sh").read_text(encoding="utf-8")
for archive in ("QEMU", "FFI", "ICONV", "GETTEXT", "GLIB", "PIXMAN", "SLIRP"):
    match = re.search(rf'^{archive}_SHA256="([0-9a-f]{{64}})"$', sources_script, re.MULTILINE)
    require(match is not None, f"{archive} archive SHA-256 pin")
    require(
        f'fetch "${archive}_SRC" "${archive}_SHA256"' in fetch_script,
        f"{archive} download must enforce its SHA-256 pin",
    )
require("source verification failed" in fetch_script, "archive mismatch must fail before unpack")
require((ROOT / ".github/workflows/build-ipa.yml").is_file(), "IPA workflow")
require(
    (ROOT / "LICENSE").is_file()
    and (ROOT / "NOTICE.md").is_file()
    and (ROOT / "SOURCE_MANIFEST.md").is_file(),
    "GPL distribution files",
)
notice_config = ROOT / "third_party/NOTICE_COMPONENTS.json"
notice_generator = ROOT / "scripts/generate_third_party_notices.py"
notice_docs = ROOT / "THIRD_PARTY_NOTICES.md"
require(notice_config.is_file() and notice_generator.is_file() and notice_docs.is_file(), "third-party notice pipeline")
components = json.loads(notice_config.read_text(encoding="utf-8"))["components"]
required_components = {
    "qemu", "edk2-firmware", "libffi", "glib", "pixman", "libucontext", "libslirp",
    "angle", "libepoxy", "virglrenderer", "moltenvk", "spirv-cross",
    "stikjit", "stikjit-idevice", "stikjit-idevice-crates", "rppairing-rust-crates",
}
require(required_components.issubset({item["id"] for item in components}), "native dependency notice inventory")
components_by_id = {item["id"]: item for item in components}
qemu_notice = components_by_id["qemu"]
edk2_notice = components_by_id["edk2-firmware"]
require(qemu_notice["distribution"] == "libqemu-aarch64-softmmu.dylib", "QEMU notice scope")
require(
    edk2_notice["source_url"]
    == "https://github.com/tianocore/edk2/tree/edk2-stable202302",
    "EDK II corresponding-source URL",
)
require(
    edk2_notice["source_root"].endswith("/pc-bios")
    and edk2_notice["scan"] == "files"
    and set(edk2_notice["files"]) == {"README", "edk2-licenses.txt"}
    and set(edk2_notice["required_files"]) == {"README", "edk2-licenses.txt"},
    "EDK II firmware notices",
)
require(
    "OpenSSL_1_1_1s" in edk2_notice["source_pin"]
    and "b64af41c3276f97f0e181920400ee056b9c88037" in edk2_notice["source_pin"],
    "EDK II embedded dependency pins",
)
stikjit_idevice = components_by_id["stikjit-idevice"]
stikjit = components_by_id["stikjit"]
require(
    "32287268fa5824f9edce4cb359f5833ce0cf7b00" in stikjit["source_pin"],
    "StikJIT source commit",
)
require(
    stikjit_idevice.get("git_commit")
    == "d32c8189c51c2789496b0768039419c3705498c3"
    and "high-confidence reconstructed compatible source"
    in stikjit_idevice["source_pin"],
    "StikJIT idevice compatible-source provenance",
)
require(
    all("StikJIT 1.9.0 Cargo.lock" not in item.get("source_pin", "") for item in components),
    "StikJIT must not claim a nonexistent upstream Cargo.lock",
)
ci_script = (ROOT / "scripts/ci_build.sh").read_text(encoding="utf-8")
stikjit_notices_script = (ROOT / "scripts/prepare_stikjit_notices.sh").read_text(
    encoding="utf-8"
)
require("prepare_stikjit_notices.sh" in ci_script, "clean CI must generate StikJIT notices")
require(
    "status --porcelain --untracked-files=normal" in ci_script,
    "clean CI build stamp must detect untracked inputs",
)
require("prepare_stikjit_notices.sh" in package_script, "standalone packaging must generate StikJIT notices")
require(
    "--features obfuscate" in stikjit_notices_script
    and "--package idevice-ffi" in stikjit_notices_script,
    "StikJIT idevice-ffi runtime feature graph",
)
require("generate_third_party_notices.py" in package_script, "standalone packaging must generate notices")
require("legal/THIRD_PARTY_NOTICES.txt" in package_script, "IPA must contain third-party notices")
require("build/legal" in workflow, "CI artifact must upload generated notices")

print("PASS: DroidDeck identity, version, icon, URL scheme, workflow, and licence files are consistent.")
