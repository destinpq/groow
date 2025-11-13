#!/bin/bash
# Fix Groow Frontend to use HTTPS upstream connection

set -e

echo "Fixing Groow frontend Caddy configuration to use HTTPS upstream..."

# Backup current Caddyfile
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S)

# Create a temporary file with the fix
sudo cat /etc/caddy/Caddyfile | sed '/^groow\.destinpq\.com {$/,/^}$/{
    s/reverse_proxy localhost:21441/reverse_proxy https:\/\/localhost:21441 {\n        transport http {\n            tls_insecure_skip_verify\n        }/
}' | sudo tee /tmp/caddyfile_fixed.tmp > /dev/null

# Apply the fix
sudo cp /tmp/caddyfile_fixed.tmp /etc/caddy/Caddyfile

echo "Testing configuration..."
if sudo caddy validate --config /etc/caddy/Caddyfile 2>&1; then
    echo "✓ Configuration valid!"
    echo "Reloading Caddy..."
    sudo systemctl reload caddy
    echo "✓ Done! Testing..."
    sleep 2
    curl -I https://groow.destinpq.com 2>&1 | head -5
else
    echo "✗ Configuration invalid, restoring backup..."
    sudo cp /etc/caddy/Caddyfile.backup.* /etc/caddy/Caddyfile 2>/dev/null | tail -1
    exit 1
fi

rm -f /tmp/caddyfile_fixed.tmp
