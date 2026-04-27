#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE_URL="$(git -C "$ROOT_DIR" config --get remote.origin.url)"
TMP_INDEX="$(mktemp)"

cleanup() {
  rm -f "$TMP_INDEX"
}
trap cleanup EXIT

cd "$ROOT_DIR"

GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/Sing- npm run build

touch "$ROOT_DIR/dist/.nojekyll"

GIT_INDEX_FILE="$TMP_INDEX" git --git-dir="$ROOT_DIR/.git" --work-tree="$ROOT_DIR/dist" add -A -f .
TREE_SHA="$(GIT_INDEX_FILE="$TMP_INDEX" git --git-dir="$ROOT_DIR/.git" write-tree)"
PARENT_SHA="$(git -C "$ROOT_DIR" rev-parse origin/main)"
COMMIT_SHA="$(printf 'deploy: publish Sing Walking site\n' | git -C "$ROOT_DIR" commit-tree "$TREE_SHA" -p "$PARENT_SHA")"

git -C "$ROOT_DIR" -c http.version=HTTP/1.1 -c http.lowSpeedLimit=1 -c http.lowSpeedTime=300 push "$REMOTE_URL" "$COMMIT_SHA:refs/heads/main"
git -C "$ROOT_DIR" update-ref refs/remotes/origin/main "$COMMIT_SHA"

echo "Published to GitHub Pages: https://kongpanxing548-lang.github.io/Sing-/"
