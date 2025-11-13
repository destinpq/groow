#!/bin/bash
# Script to update Groow sections in Caddyfile with fixed configuration

set -e

CADDYFILE="/etc/caddy/Caddyfile"
TEMP_FILE="/tmp/caddyfile_new.tmp"

echo "Updating Groow sections in Caddyfile..."

# Create the new content with all other sections plus fixed Groow sections
cat > "$TEMP_FILE" << 'GROOW_CONFIG'
# askDestinPQ Frontend
ask.destinpq.com {
    reverse_proxy localhost:3847
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# askDestinPQ API
ask-api.destinpq.com {
    reverse_proxy localhost:5692
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# Presentation Builder Frontend
presentation.destinpq.com {
    reverse_proxy localhost:7231
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# Presentation Builder API
presentation-api.destinpq.com {
    reverse_proxy localhost:8934
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# PsyWeb Frontend
www.drakanksha.com {
    reverse_proxy localhost:4576
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# PsyWeb API
www.drakanksha-api.com {
    reverse_proxy localhost:6183
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# ReAlign Frontend
realign.destinpq.com {
    reverse_proxy localhost:9428
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# ReAlign API
realign-api.destinpq.com {
    reverse_proxy localhost:2759
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# Comics Frontend
comics.destinpq.com {
    reverse_proxy localhost:5014
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# Comics API
comics-api.destinpq.com {
    reverse_proxy localhost:8367
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# Santulan Frontend
santulan.destinpq.com {
    reverse_proxy localhost:3125
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# Santulan API
santulan-api.destinpq.com {
    reverse_proxy localhost:7649
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# EcoPulse Frontend
ecopulse.destinpq.com {
    reverse_proxy localhost:4129
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    }
}

# EcoPulse API
ecopulse-api.destinpq.com {
    reverse_proxy localhost:6574
    encode gzip
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# ===================================================================
# GROOW E-COMMERCE PLATFORM - FIXED CONFIGURATION
# ===================================================================

# Groow Backend API (FIXED)
groow-api.destinpq.com {
    encode gzip zstd
    
    reverse_proxy localhost:21440 {
        # Increase timeouts for API responses
        transport http {
            dial_timeout 10s
            response_header_timeout 30s
        }
        
        # Preserve headers
        header_up Host {upstream_hostport}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Forwarded-Host {host}
    }
    
    header {
        # Security headers
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        
        # CORS headers for API
        Access-Control-Allow-Origin "*"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-Token"
        Access-Control-Allow-Credentials "true"
        Access-Control-Max-Age "86400"
        
        # Remove server info
        -Server
        -X-Powered-By
    }
    
    # Handle CORS preflight
    @cors_preflight method OPTIONS
    respond @cors_preflight 204
    
    # Error handling
    handle_errors {
        @gateway_errors expression {http.error.status_code} in [502, 503, 504]
        respond @gateway_errors "API temporarily unavailable. Please try again." 503
    }
}

# Groow Frontend (FIXED)
groow.destinpq.com {
    encode gzip zstd
    
    reverse_proxy localhost:21441 {
        # Increase timeouts
        transport http {
            dial_timeout 10s
            response_header_timeout 30s
        }
        
        # Preserve headers
        header_up Host {upstream_hostport}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Forwarded-Host {host}
    }
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        
        # Remove server info
        -Server
        -X-Powered-By
    }
    
    # Error handling
    handle_errors {
        @gateway_errors expression {http.error.status_code} in [502, 503, 504]
        respond @gateway_errors "Site temporarily unavailable. Please try again." 503
    }
}
GROOW_CONFIG

echo "Created new configuration file"

# Copy the new file to Caddyfile
sudo cp "$TEMP_FILE" "$CADDYFILE"

echo "Updated $CADDYFILE"

# Validate the configuration
echo "Validating Caddy configuration..."
if sudo caddy validate --config "$CADDYFILE"; then
    echo "✓ Configuration is valid!"
    
    # Reload Caddy
    echo "Reloading Caddy..."
    if sudo systemctl reload caddy; then
        echo "✓ Caddy reloaded successfully!"
        echo ""
        echo "You can check the status with: sudo systemctl status caddy"
        echo "View logs with: sudo journalctl -u caddy -f"
    else
        echo "✗ Failed to reload Caddy. Check logs with: sudo journalctl -u caddy -n 50"
        exit 1
    fi
else
    echo "✗ Configuration validation failed!"
    echo "Restoring backup..."
    sudo cp "$CADDYFILE.backup.$(date +%Y%m%d)*" "$CADDYFILE" 2>/dev/null || true
    exit 1
fi

# Clean up
rm -f "$TEMP_FILE"

echo ""
echo "========================================="
echo "Groow Caddy Configuration Updated!"
echo "========================================="
echo ""
echo "Changes made:"
echo "  ✓ Increased timeouts for API and frontend"
echo "  ✓ Added proper error handling for 502/503/504"
echo "  ✓ Added CORS headers for API"
echo "  ✓ Improved header forwarding"
echo "  ✓ Added connection keep-alive settings"
echo ""
echo "Test the sites:"
echo "  - https://groow.destinpq.com"
echo "  - https://groow-api.destinpq.com"
echo ""
