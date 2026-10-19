#!/bin/bash
# DroidDeck: build the pinned-source Android MVP from a clean checkout to the IPA.
#
# Runs on macOS with Xcode. Usage: ./scripts/ci_build.sh [output.ipa]
set -euo pipefail

HUSK_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$HUSK_ROOT/build/DroidDeck.ipa}"
cd "$HUSK_ROOT"

# Keep both packages stamped with the exact same input revision, captured
# before any generator or dependency build can touch tracked files.
HUSK_SOURCE_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
if [ -n "$(git status --porcelain --untracked-files=normal 2>/dev/null)" ]; then
    HUSK_SOURCE_COMMIT="$HUSK_SOURCE_COMMIT-dirty"
fi
export HUSK_SOURCE_COMMIT

step() { printf '\n\033[1;34m##### %s\033[0m\n' "$*"; }

step "fetch sources"
./scripts/fetch_sources.sh

step "dependencies: libffi glib pixman libucontext libslirp"
./scripts/build_ios.sh libffi glib pixman libucontext libslirp

# build_gpu_ios.sh asks for cross-ios-darwin.meson, which no script generates.
# build_ios.sh writes cross-darwin.meson, the file it describes (host system
# darwin, subsystem ios), under a different name.
cp build/ios-arm64/cross-darwin.meson build/ios-arm64/cross-ios-darwin.meson

if [ ! -f build/ios-arm64/sysroot/lib/libANGLE-shared.dylib ]; then
    step "ANGLE (EGL/GLES over Metal)"
    ./scripts/build_angle_ios.sh
fi

if [ ! -f build/ios-arm64/sysroot/lib/libvirglrenderer.a ]; then
    step "libepoxy + virglrenderer"
    # build_ios.sh's cross environment, which the GPU script assumes is set.
    PKG_CONFIG_LIBDIR="$HUSK_ROOT/build/ios-arm64/sysroot/lib/pkgconfig:$HUSK_ROOT/build/ios-arm64/sysroot/share/pkgconfig" \
        ./scripts/build_gpu_ios.sh
fi

step "QEMU"
./scripts/build_ios.sh qemu

step "integrate Husk sources into QEMU, then rebuild it"
./scripts/integrate_husk.sh
./scripts/build_ios.sh qemurebuild

if [ ! -d build/ios-arm64/lib/MoltenVK.xcframework ]; then
    step "MoltenVK (Vulkan over Metal, for Unreal Engine games)"
    ./scripts/build_moltenvk_ios.sh
fi

step "on-device pairing (Rust)"
./scripts/build_rppairing_ios.sh

step "StikJIT idevice dependency notices"
bash ./scripts/prepare_stikjit_notices.sh

step "third-party notices"
python3 ./scripts/generate_third_party_notices.py --output-dir build/legal
# package_ipa.sh regenerates notices for a standalone invocation.  A clean CI
# build already did so after every dependency was resolved, and both output
# packages must use that one byte-identical set.
export DROIDDECK_LEGAL_PREPARED=1

step "app + IPA"
mkdir -p "$(dirname "$OUT")"
./scripts/package_ipa.sh "$OUT"
./scripts/package_ipa.sh --trollstore "${OUT%.ipa}.tipa"
