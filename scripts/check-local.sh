#!/usr/bin/env bash
# The repository's own gate: the offline validator and its tests. No
# dependencies to install and no request leaves the machine.
#   bash scripts/check-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."

node_executable="$(command -v "${NODE_EXECUTABLE:-node}")"
"$node_executable" -e 'const [major] = process.versions.node.split(".").map(Number); if (major < 24) throw new Error("Node 24 or newer is required")'
"$node_executable" scripts/validate.mjs
"$node_executable" --test scripts/validate.test.mjs
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  git diff --check -- .
fi
