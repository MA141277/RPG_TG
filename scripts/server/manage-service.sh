#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-rpg-tg}"
ACTION="${1:-status}"

case "${ACTION}" in
  start|stop|restart|status)
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

exec systemctl "${ACTION}" "${SERVICE_NAME}"
