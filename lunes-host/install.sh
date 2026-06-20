#!/usr/bin/env bash
set -e

# ============================================================
# Lunes Node - One-Click Installer
# ============================================================
# Usage:
#   curl -s https://raw.githubusercontent.com/wdrma2010/Lunes-node/main/lunes-host/install.sh |
#   env DOMAIN=node24.lunes.host PORT=3134 UUID=$(cat /proc/sys/kernel/random/uuid) HY2_PASSWORD='YourPassword' bash
# ============================================================

DOMAIN="${DOMAIN:-node24.lunes.host}"
PORT="${PORT:-3134}"
UUID="${UUID:-$(cat /proc/sys/kernel/random/uuid)}"
HY2_PASSWORD="${HY2_PASSWORD:-$(openssl rand -base64 16)}"

echo "============================================================"
echo "  Lunes Node Installer"
echo "============================================================"
echo "  Domain:    $DOMAIN"
echo "  Port:      $PORT"
echo "  UUID:      $UUID"
echo "============================================================"

# Base URL for raw files
BASE_URL="https://raw.githubusercontent.com/wdrma2010/Lunes-node/main/lunes-host"

# Download files
echo "[1/3] Downloading files..."
curl -sSL -o /home/container/setup.js "$BASE_URL/setup.js"
curl -sSL -o /home/container/app.js "$BASE_URL/app.js"
curl -sSL -o /home/container/package.json "$BASE_URL/package.json"

# Replace placeholders in setup.js
echo "[2/3] Configuring..."
sed -i "s|YOUR_UUID|$UUID|g" /home/container/setup.js
sed -i "s|YOUR_DOMAIN.lunes.host|$DOMAIN|g" /home/container/setup.js
sed -i "s|PORT = 3134|PORT = $PORT|g" /home/container/setup.js
sed -i "s|YOUR_PASSWORD|$HY2_PASSWORD|g" /home/container/setup.js

# Download Xray
echo "[3/3] Installing Xray-core..."
mkdir -p /home/container/xy
cd /home/container/xy
curl -sSL -o Xray-linux-64.zip https://github.com/XTLS/Xray-core/releases/download/v25.8.3/Xray-linux-64.zip
unzip -q -o Xray-linux-64.zip
rm -f Xray-linux-64.zip
mv xray xy
chmod +x xy

# Download Hysteria2
mkdir -p /home/container/h2
cd /home/container/h2
curl -sSL -o h2 https://github.com/apernet/hysteria/releases/download/app%2Fv2.6.2/hysteria-linux-amd64
chmod +x h2

echo ""
echo "============================================================"
echo "  Installation Complete!"
echo "============================================================"
echo ""
echo "  Next steps:"
echo "  1. Set Startup Command to: node setup.js"
echo "  2. Restart the container"
echo "  3. Check node.txt for connection URLs"
echo ""
echo "============================================================"
