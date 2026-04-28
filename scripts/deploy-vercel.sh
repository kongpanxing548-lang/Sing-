#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_NAME="sing-walking-v5"

cd "$ROOT_DIR"

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI is required. Install it with: npm i -g vercel"
  exit 1
fi

npm run build

rm -rf "$ROOT_DIR/.vercel/output"
mkdir -p "$ROOT_DIR/.vercel/output/static"
rsync -a "$ROOT_DIR/dist/" "$ROOT_DIR/.vercel/output/static/"
printf '%s\n' '{"version":3,"routes":[{"handle":"filesystem"},{"src":"/.*","status":404,"dest":"/404.html"}]}' \
  > "$ROOT_DIR/.vercel/output/config.json"

if [ ! -f "$ROOT_DIR/.vercel/project.json" ]; then
  vercel link --yes --project "$PROJECT_NAME"
fi

vercel deploy --prebuilt --yes "$@"
