#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8080}"
STATIC_ROOT="${STATIC_ROOT:-dist}"

cd "${PROJECT_ROOT}"
exec node scripts/serve-static.mjs --host "${HOST}" --port "${PORT}" --root "${STATIC_ROOT}"
