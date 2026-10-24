#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

NAME="${NPM_NAME:-dsh-ai-book-shelf}"
VERSION="$(node -p "require('./package.json').version")"
OUT_DIR="$(cd .. && pwd)/dist"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$OUT_DIR"
echo "Packing source $VERSION ..."
npm pack --pack-destination "$TMP" >/dev/null
tar -xzf "$TMP"/*.tgz -C "$TMP"

node - "$TMP/package/package.json" "$TMP/package/cordis.patch.yml" "$NAME" "$VERSION" <<'NODE'
const fs = require('fs')
const [pkgFile, patchFile, name, version] = process.argv.slice(2)
const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
pkg.name = name
pkg.version = version
delete pkg.private
pkg.repository = { type: 'git', url: 'https://github.com/0avatar0/dsh-ai-book-shelf.git' }
pkg.homepage = 'https://github.com/0avatar0/dsh-ai-book-shelf'
fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n')

const patch = fs.readFileSync(patchFile, 'utf8').replace(
  /name:\s*['"]@local\/dsh-epub-reader['"]/,
  `name: '${name}'`,
)
fs.writeFileSync(patchFile, patch)
NODE

mkdir -p "$TMP/out"
cd "$TMP/package"
npm pack --pack-destination "$TMP/out" >/dev/null
cp "$TMP/out"/*.tgz "$OUT_DIR/$NAME-$VERSION.tgz"
echo "Built $OUT_DIR/$NAME-$VERSION.tgz"
