#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run this script with sudo or as root."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SERVICE_NAME="${SERVICE_NAME:-rpg-tg}"
SERVICE_USER="${SERVICE_USER:-${SUDO_USER:-$(id -un)}}"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8080}"
STATIC_ROOT="${STATIC_ROOT:-dist}"
NODE_BIN="${NODE_BIN:-$(command -v node)}"
UNIT_PATH="/etc/systemd/system/${SERVICE_NAME}.service"

if [[ -z "${NODE_BIN}" ]]; then
  echo "Node.js was not found in PATH."
  exit 1
fi

cat > "${UNIT_PATH}" <<EOF
[Unit]
Description=RPG_TG static game server
After=network.target

[Service]
Type=simple
User=${SERVICE_USER}
WorkingDirectory=${PROJECT_ROOT}
ExecStart=${NODE_BIN} scripts/serve-static.mjs --host ${HOST} --port ${PORT} --root ${STATIC_ROOT}
Restart=always
RestartSec=3
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"
systemctl restart "${SERVICE_NAME}"
systemctl status "${SERVICE_NAME}" --no-pager
