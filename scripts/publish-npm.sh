#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

NAME="${NPM_NAME:-dsh-ai-book-shelf}"
VERSION="$(node -p "require('./package.json').version")"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Packing $NAME@$VERSION ..."
npm pack --pack-destination "$TMP" >/dev/null
tar -xzf "$TMP"/*.tgz -C "$TMP"

node - "$TMP/package/package.json" "$TMP/package/cordis.patch.yml" "$NAME" "$VERSION" <<'NODE'
const fs = require('fs')
const [file, patchFile, name, version] = process.argv.slice(2)
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
pkg.name = name
pkg.version = version
delete pkg.private
pkg.repository = { type: 'git', url: 'https://github.com/0avatar0/dsh-ai-book-shelf.git' }
pkg.homepage = 'https://github.com/0avatar0/dsh-ai-book-shelf'
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
const patch = fs.readFileSync(patchFile, 'utf8').replace(
  /name:\s*['"]@local\/dsh-epub-reader['"]/,
  `name: '${name}'`,
)
fs.writeFileSync(patchFile, patch)
NODE

echo "Publishing $NAME@$VERSION ..."
cd "$TMP/package"
npm publish --access public
