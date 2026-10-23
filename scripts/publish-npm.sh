#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

NAME="${NPM_NAME:-dsh-reading-shelf}"
VERSION="$(node -p "require('./package.json').version")"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Packing $NAME@$VERSION ..."
pnpm pack --pack-destination "$TMP" >/dev/null
tar -xzf "$TMP"/*.tgz -C "$TMP"

node - "$TMP/package/package.json" "$NAME" "$VERSION" <<'NODE'
const fs = require('fs')
const [file, name, version] = process.argv.slice(2)
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
pkg.name = name
pkg.version = version
delete pkg.private
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
NODE

echo "Publishing $NAME@$VERSION ..."
cd "$TMP/package"
npm publish --access public
