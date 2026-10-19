#!/bin/bash
# Reconstruct the licence inventory for the idevice-ffi static archive bundled
# inside StikJIT 1.9.0. StikJIT does not publish the archive's source revision,
# so this is deliberately described as high-confidence compatible source, not
# as an upstream-attested exact-source claim. See THIRD_PARTY_NOTICES.md.
set -euo pipefail

HUSK_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IDEVICE_URL="https://github.com/jkcoxson/idevice.git"
IDEVICE_COMMIT="d32c8189c51c2789496b0768039419c3705498c3"
SRC="$HUSK_ROOT/third_party/build/idevice-$IDEVICE_COMMIT"
OUTPUT="$HUSK_ROOT/src/app/Husk/Resources/legal/LICENSES-StikJIT-idevice-crates.txt"
PYTHON="${PYTHON:-python3}"

if [ -e "$SRC" ] && [ ! -d "$SRC/.git" ]; then
    echo "idevice notice source exists but is not a Git checkout: $SRC" >&2
    exit 1
fi
if [ ! -d "$SRC/.git" ]; then
    mkdir -p "$SRC"
    git -C "$SRC" init -q
    git -C "$SRC" remote add origin "$IDEVICE_URL"
fi
if [ "$(git -C "$SRC" remote get-url origin)" != "$IDEVICE_URL" ]; then
    echo "unexpected idevice origin in $SRC" >&2
    exit 1
fi
if ! git -C "$SRC" cat-file -e "$IDEVICE_COMMIT^{commit}" 2>/dev/null; then
    git -C "$SRC" fetch -q --depth 1 origin "$IDEVICE_COMMIT"
fi
git -C "$SRC" checkout -q --detach "$IDEVICE_COMMIT"
if [ "$(git -C "$SRC" rev-parse HEAD)" != "$IDEVICE_COMMIT" ]; then
    echo "idevice checkout did not resolve to $IDEVICE_COMMIT" >&2
    exit 1
fi
if ! git -C "$SRC" diff --quiet -- .; then
    echo "idevice notice source has tracked modifications: $SRC" >&2
    exit 1
fi

# idevice's own Apple build recipe enables `obfuscate` in addition to the
# idevice-ffi defaults. cargo tree is locked to d32c's Cargo.lock and excludes
# build/dev/proc-macro-only packages that are not linked into the archive.
"$PYTHON" "$HUSK_ROOT/src/rppairing-ios/notices.py" \
    --manifest-path "$SRC/ffi/Cargo.toml" \
    --package idevice-ffi \
    --features obfuscate \
    --label "the idevice-ffi static archive bundled in StikJIT 1.9.0" \
    "$OUTPUT"
