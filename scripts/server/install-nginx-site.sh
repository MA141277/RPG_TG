#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run this script with sudo or as root."
  exit 1
fi

SERVER_IP="${SERVER_IP:-159.75.153.83}"
UPSTREAM_HOST="${UPSTREAM_HOST:-127.0.0.1}"
UPSTREAM_PORT="${UPSTREAM_PORT:-8080}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-/etc/nginx/conf.d/rpg-tg.conf}"

cat > "${NGINX_CONF_PATH}" <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${SERVER_IP};

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_pass http://${UPSTREAM_HOST}:${UPSTREAM_PORT};
    }
}
EOF

nginx -t
systemctl reload nginx
