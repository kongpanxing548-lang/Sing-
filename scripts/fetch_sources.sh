#!/bin/bash
# Download + unpack every Husk dependency into third_party/sources and third_party/build.
set -u
HUSK_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
. "$HUSK_ROOT/scripts/sources.sh"
DL="$HUSK_ROOT/third_party/sources"
SRC="$HUSK_ROOT/third_party/build"
mkdir -p "$DL" "$SRC"

sha256_file() {
    if command -v shasum >/dev/null 2>&1; then
        shasum -a 256 "$1" | awk '{print $1}'
    elif command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" | awk '{print $1}'
    else
        echo "[FAIL] no SHA-256 tool found (need shasum or sha256sum)" >&2
        return 1
    fi
}

fetch() {
    local url="$1" expected="$2" file="$DL/$(basename "$1")" actual
    case "$expected" in
        ''|*[!0-9a-f]*) echo "[FAIL] invalid SHA-256 pin for $(basename "$file")" >&2; return 1 ;;
    esac
    if [ "${#expected}" -ne 64 ]; then
        echo "[FAIL] invalid SHA-256 pin for $(basename "$file")" >&2
        return 1
    fi
    if [ -s "$file" ]; then
        actual="$(sha256_file "$file")" || return 1
        if [ "$actual" != "$expected" ]; then
            echo "[FAIL] cached $(basename "$file") SHA-256 $actual (expected $expected)" >&2
            return 1
        fi
        echo "[skip] $(basename "$file") (SHA-256 verified)"
        return 0
    fi
    echo "[get ] $(basename "$file")"
    curl -fL --retry 3 --retry-delay 5 -o "$file.part" "$url" || { echo "[FAIL] $url"; return 1; }
    actual="$(sha256_file "$file.part")" || { rm -f "$file.part"; return 1; }
    if [ "$actual" != "$expected" ]; then
        echo "[FAIL] downloaded $(basename "$file") SHA-256 $actual (expected $expected)" >&2
        rm -f "$file.part"
        return 1
    fi
    mv "$file.part" "$file"
}

unpack() {
    local file="$DL/$(basename "$1")" stamp
    stamp="$SRC/.unpacked-$(basename "$file")"
    [ -f "$stamp" ] && { echo "[skip] unpack $(basename "$file")"; return 0; }
    echo "[tar ] $(basename "$file")"
    tar -xf "$file" -C "$SRC" || return 1
    touch "$stamp"
}

rc=0
fetch "$FFI_SRC" "$FFI_SHA256" || rc=1
fetch "$ICONV_SRC" "$ICONV_SHA256" || rc=1
fetch "$GETTEXT_SRC" "$GETTEXT_SHA256" || rc=1
fetch "$GLIB_SRC" "$GLIB_SHA256" || rc=1
fetch "$PIXMAN_SRC" "$PIXMAN_SHA256" || rc=1
fetch "$SLIRP_SRC" "$SLIRP_SHA256" || rc=1
fetch "$QEMU_SRC" "$QEMU_SHA256" || rc=1

# Do not unpack or build from even one unverified input. In particular, a
# non-empty poisoned Actions cache must not become a source tree merely because
# tar can parse it.
if [ "$rc" -ne 0 ]; then
    echo "--- source verification failed ---" >&2
    exit "$rc"
fi
for u in "$FFI_SRC" "$ICONV_SRC" "$GETTEXT_SRC" "$GLIB_SRC" "$PIXMAN_SRC" "$SLIRP_SRC" "$QEMU_SRC"; do
    unpack "$u" || rc=1
done

if [ ! -d "$SRC/libucontext" ]; then
    echo "[git ] libucontext"
    git clone "$LIBUCONTEXT_REPO" "$SRC/libucontext" >/dev/null 2>&1 \
        && git -C "$SRC/libucontext" checkout -q "$LIBUCONTEXT_COMMIT" \
        || { echo "[FAIL] libucontext"; rc=1; }
else
    echo "[skip] libucontext"
fi

echo "--- result rc=$rc ---"
ls -1 "$SRC" | grep -v '^\.' 
exit $rc
