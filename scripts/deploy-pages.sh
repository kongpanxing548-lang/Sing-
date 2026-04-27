#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE_URL="$(git -C "$ROOT_DIR" config --get remote.origin.url)"
DEPLOY_DIR="${TMPDIR:-/tmp}/sing-pages-main"

cd "$ROOT_DIR"

GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/Sing- npm run build

rm -rf "$DEPLOY_DIR"
git worktree prune
git worktree add --detach "$DEPLOY_DIR" origin/main

rsync -a --delete \
  --exclude ".git" \
  "$ROOT_DIR/dist/" \
  "$DEPLOY_DIR/"

touch "$DEPLOY_DIR/.nojekyll"

git -C "$DEPLOY_DIR" add -A

if git -C "$DEPLOY_DIR" diff --cached --quiet; then
  echo "No Pages changes to deploy."
  exit 0
fi

git -C "$DEPLOY_DIR" commit -m "deploy: publish Sing Walking site"
git -C "$DEPLOY_DIR" -c http.version=HTTP/1.1 -c http.lowSpeedLimit=1 -c http.lowSpeedTime=300 push "$REMOTE_URL" HEAD:main

echo "Published to GitHub Pages: https://kongpanxing548-lang.github.io/Sing-/"
