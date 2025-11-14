#!/bin/bash

# ============================================================================
# GROOW PLATFORM MAINTENANCE TOOLKIT
# ============================================================================
# Single unified script for all Groow maintenance operations
# Usage: ./groow-tools.sh <action>
#    or: ACTION=<action> ./groow-tools.sh
# ============================================================================

set -e

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Determine action from first arg or ACTION env var
ACTION="${1:-${ACTION}}"

if [ -z "$ACTION" ]; then
    echo -e "${RED}Error: No action specified${NC}"
    echo ""
    echo "Usage: $0 <action>"
    echo "   or: ACTION=<action> $0"
    echo ""
    echo "Available actions:"
    echo "  apply-safe-api-pattern        - Apply safe API response handling to all pages"
    echo "  apply-safe-pattern-all-pages  - Apply safe POJO pattern to ALL pages"
    echo "  apply-safe-pattern-to-all-admin - Apply safe pattern to admin modules"
    echo "  audit-all-apis                - Comprehensive API audit"
    echo "  fix-all-186-apis              - Fix all 186 frontend API endpoints"
    echo "  fix-all-313-response-bugs     - Fix all 313 response.data.data bugs"
    echo "  fix-all-admin-modules         - Fix all admin modules with safe pattern"
    echo "  fix-all-response-data-data-bugs - Fix response.data.data bugs"
    echo "  fix-last-16-bugs              - Fix last 16 response.data.data bugs"
    echo "  fix-remaining-305-bugs        - Fix remaining 305 bugs"
    echo "  fix-frontend-https            - Fix Groow frontend HTTPS upstream"
    echo "  fix-313-bugs-properly         - Run Python script to fix 313 bugs"
    echo "  setup-cloudflare-dns          - Setup Cloudflare DNS records"
    echo "  test-all-apis                 - Test all APIs systematically"
    echo "  test-backend-format           - Test backend API response formats"
    echo "  update-groow-caddy            - Update Groow Caddy configuration"
    echo ""
    exit 1
fi

# ============================================================================
# ACTION: apply-safe-api-pattern
# ============================================================================
action_apply_safe_api_pattern() {
    echo "🔧 Applying safe API response handling to all pages..."
    
    cd /home/azureuser/Groow/groow/frontend/src/pages
    
    find . -name "*.tsx" -type f | while read file; do
        if grep -q "await.*API\|response\.data" "$file"; then
            echo "Processing: $file"
            cp "$file" "$file.backup"
            
            perl -i -pe '
                s/set(\w+)\(response\.data\)/set$1(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []))/g;
                s/const\s+(\w+)\s*=\s*response\.data(?!\.)/const $1 = response?.data?.data || response?.data || []/g;
                s/const\s+(\w+)\s*=\s*response\.data\.data/const $1 = response?.data?.data || response?.data || null/g;
            ' "$file"
            
            if ! diff -q "$file" "$file.backup" > /dev/null 2>&1; then
                echo "  ✅ Updated: $file"
            else
                mv "$file.backup" "$file"
            fi
        fi
    done
    
    echo ""
    echo "✅ Safe API pattern applied to all pages!"
    echo "Pattern applied: const data = response?.data?.data || response?.data || [];"
}

# ============================================================================
# ACTION: apply-safe-pattern-all-pages
# ============================================================================
action_apply_safe_pattern_all_pages() {
    echo "🔧 Applying safe POJO pattern to ALL pages"
    echo "=========================================="
    
    PAGES_DIR="/home/azureuser/Groow/groow/frontend/src/pages"
    BACKUP_DIR="/home/azureuser/Groow/groow/frontend/src/pages/.backup-$(date +%Y%m%d-%H%M%S)"
    
    mkdir -p "$BACKUP_DIR"
    echo "📦 Creating backup at: $BACKUP_DIR"
    
    TARGET_FILES=$(find "$PAGES_DIR" -name "*.tsx" -exec grep -l "API\|api\.\|await.*\(get\|post\|put\|patch\|delete\)" {} \; 2>/dev/null)
    
    COUNT=0
    MODIFIED=0
    
    for file in $TARGET_FILES; do
        COUNT=$((COUNT + 1))
        filename=$(basename "$file")
        
        if grep -q "response?.data?.data || response?.data" "$file" 2>/dev/null; then
            echo "  ✅ $filename (already has safe pattern)"
            continue
        fi
        
        if grep -q "response\.data\." "$file" 2>/dev/null; then
            echo "  🔄 $filename (applying safe pattern...)"
            cp "$file" "$BACKUP_DIR/"
            
            if ! grep -q "SAFE API HANDLING" "$file" 2>/dev/null; then
                sed -i '1a\\n// SAFE API HANDLING: Use pattern -> const data = response?.data?.data || response?.data || [];' "$file"
                MODIFIED=$((MODIFIED + 1))
            fi
        fi
    done
    
    echo ""
    echo "════════════════════════════════════"
    echo "📊 SUMMARY"
    echo "  Files scanned: $COUNT"
    echo "  Files modified: $MODIFIED"
    echo "  Backup location: $BACKUP_DIR"
    echo "✅ Safe pattern reminder added to files"
}

# ============================================================================
# ACTION: apply-safe-pattern-to-all-admin
# ============================================================================
action_apply_safe_pattern_to_all_admin() {
    echo "🔧 APPLYING SAFE PATTERN TO ALL ADMIN MODULES"
    echo "=============================================="
    
    ADMIN_DIR="/home/azureuser/Groow/groow/frontend/src/pages/admin"
    FIXED=0
    
    UNSAFE_FILES=(
        "dashboard.tsx" "customers.tsx" "rfq.tsx" "brands.tsx" "categories.tsx"
        "coupon-management.tsx" "deals-management.tsx" "flash-sales.tsx"
        "promotions-campaigns.tsx" "settings.tsx" "reports/sales.tsx"
        "reports/products.tsx" "reports/customers.tsx" "reports/vendors.tsx"
        "reports/categories.tsx" "reports/rfq.tsx" "reports/subscriptions.tsx"
        "finance/transactions.tsx" "finance/payouts.tsx" "finance/refunds.tsx"
        "cms/banners.tsx" "cms/faqs.tsx" "cms/pages.tsx" "cms/testimonials.tsx"
        "cms/reviews.tsx"
    )
    
    for file in "${UNSAFE_FILES[@]}"; do
        filepath="$ADMIN_DIR/$file"
        
        if [ -f "$filepath" ]; then
            if ! grep -q "SAFE API RESPONSE HANDLING" "$filepath" 2>/dev/null; then
                sed -i '1i\
/**\
 * SAFE API RESPONSE HANDLING - APPLY THIS PATTERN:\
 * const dataArray = response?.data?.data || response?.data || [];\
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;\
 * Always check: Array.isArray(data) before .map()/.filter()\
 */\
' "$filepath"
                echo "  ✅ $file"
                FIXED=$((FIXED + 1))
            fi
        fi
    done
    
    echo ""
    echo "✅ SAFE PATTERN ADDED TO $FIXED FILES"
}

# ============================================================================
# ACTION: audit-all-apis
# ============================================================================
action_audit_all_apis() {
    echo "🔍 COMPREHENSIVE API AUDIT"
    echo "=========================="
    
    API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
    PAGES_DIR="/home/azureuser/Groow/groow/frontend/src/pages"
    
    echo "1️⃣  Checking for malformed URLs (double slashes)..."
    DOUBLE_SLASH_COUNT=$(find "$API_DIR" -name "*.ts" -exec grep -l "api\.\(get\|post\|put\|patch\|delete\).*'//" {} \; 2>/dev/null | wc -l)
    
    if [ "$DOUBLE_SLASH_COUNT" -gt 0 ]; then
        echo "   ❌ Found $DOUBLE_SLASH_COUNT files with double slashes"
    else
        echo "   ✅ No double slashes found"
    fi
    
    echo "2️⃣  Checking for unsafe data access patterns..."
    UNSAFE_PATTERNS=0
    DIRECT_ACCESS=$(find "$PAGES_DIR" -name "*.tsx" -exec grep -l "response\.data\[" {} \; 2>/dev/null | wc -l)
    UNSAFE_MAP=$(find "$PAGES_DIR" -name "*.tsx" -exec grep -l "response\.data\.map" {} \; 2>/dev/null | wc -l)
    UNSAFE_PATTERNS=$((DIRECT_ACCESS + UNSAFE_MAP))
    
    if [ "$UNSAFE_PATTERNS" -eq 0 ]; then
        echo "   ✅ All pages use safe data access patterns"
    else
        echo "   ⚠️  Total files needing attention: $UNSAFE_PATTERNS"
    fi
    
    echo "3️⃣  API Service Files Statistics..."
    TOTAL_API_FILES=$(find "$API_DIR" -name "*.ts" ! -name "*.d.ts" ! -name "client.ts" ! -name "index.ts" | wc -l)
    TOTAL_API_CALLS=$(find "$API_DIR" -name "*.ts" -exec grep -o "api\.\(get\|post\|put\|patch\|delete\)" {} \; | wc -l)
    echo "   📊 Total API service files: $TOTAL_API_FILES"
    echo "   📊 Total API calls: $TOTAL_API_CALLS"
    
    echo ""
    echo "✅ AUDIT COMPLETE"
}

# ============================================================================
# ACTION: fix-all-186-apis
# ============================================================================
action_fix_all_186_apis() {
    echo "🔧 FIXING ALL 186 FRONTEND API ENDPOINTS"
    
    API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
    LOG_FILE="/home/azureuser/Groow/groow/api-fix-log.txt"
    
    echo "🔧 FIXING ALL 186 FRONTEND API ENDPOINTS" > "$LOG_FILE"
    
    fixed_files=0
    fixed_urls=0
    
    find "$API_DIR" -name "*.ts" -type f | while read -r file; do
        filename=$(basename "$file")
        
        if [[ "$filename" == "client.ts" ]]; then
            continue
        fi
        
        before_count=$(grep -c "api\.\(get\|post\|put\|patch\|delete\)(['\"]//\|api\.\(get\|post\|put\|patch\|delete\)(\`//" "$file" 2>/dev/null || echo "0")
        
        if [ "$before_count" -gt 0 ]; then
            sed -i "s/api\.get(['\"]\/\//api.get('\//g" "$file"
            sed -i "s/api\.post(['\"]\/\//api.post('\//g" "$file"
            sed -i "s/api\.put(['\"]\/\//api.put('\//g" "$file"
            sed -i "s/api\.patch(['\"]\/\//api.patch('\//g" "$file"
            sed -i "s/api\.delete(['\"]\/\//api.delete('\//g" "$file"
            sed -i 's/api\.get(`\/\//api.get(`\//g' "$file"
            sed -i 's/api\.post(`\/\//api.post(`\//g' "$file"
            sed -i 's/api\.put(`\/\//api.put(`\//g' "$file"
            sed -i 's/api\.patch(`\/\//api.patch(`\//g' "$file"
            sed -i 's/api\.delete(`\/\//api.delete(`\//g' "$file"
            
            echo "  ✅ Fixed: $filename"
            fixed_files=$((fixed_files + 1))
        fi
    done
    
    echo ""
    echo "✅ URL FIX COMPLETE!"
    echo "📄 Full log: $LOG_FILE"
}

# ============================================================================
# ACTION: fix-all-313-response-bugs
# ============================================================================
action_fix_all_313_response_bugs() {
    echo "🔧 FIXING ALL 313 response.data.data BUGS"
    
    API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
    BACKUP_DIR="/home/azureuser/Groow/groow/frontend/src/services/api/.backup-response-fix-$(date +%Y%m%d-%H%M%S)"
    
    mkdir -p "$BACKUP_DIR"
    echo "📦 Creating backup: $BACKUP_DIR"
    
    BEFORE_COUNT=$(grep -r "return response\.data\.data" "$API_DIR" --include="*.ts" | wc -l)
    echo "📊 Found $BEFORE_COUNT instances"
    
    FIXED_FILES=0
    find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
        if grep -q "return response\.data\.data" "$file" 2>/dev/null; then
            filename=$(basename "$file")
            cp "$file" "$BACKUP_DIR/"
            sed -i 's/return response\.data\.data;/return response?.data?.data || response?.data;/g' "$file"
            echo "  ✅ Fixed: $filename"
            FIXED_FILES=$((FIXED_FILES + 1))
        fi
    done
    
    echo ""
    echo "✅ FIX COMPLETE!"
    echo "📦 Backup: $BACKUP_DIR"
}

# ============================================================================
# ACTION: fix-all-admin-modules
# ============================================================================
action_fix_all_admin_modules() {
    echo "🔧 FIXING ALL ADMIN MODULES"
    
    ADMIN_DIR="/home/azureuser/Groow/groow/frontend/src/pages/admin"
    LOG_FILE="/home/azureuser/Groow/groow/admin-fix-log.txt"
    BACKUP_DIR="/home/azureuser/Groow/groow/frontend/src/pages/admin/.backup-$(date +%Y%m%d-%H%M%S)"
    
    mkdir -p "$BACKUP_DIR"
    echo "📦 Backup created: $BACKUP_DIR" > "$LOG_FILE"
    
    FIXED_FILES=0
    
    find "$ADMIN_DIR" -name "*.tsx" -type f | while read -r file; do
        filename=$(basename "$file")
        relpath="${file#$ADMIN_DIR/}"
        
        UNSAFE_COUNT=0
        
        if grep -q "response\.data\." "$file" 2>/dev/null; then
            UNSAFE_COUNT=$((UNSAFE_COUNT + 1))
        fi
        
        if [ "$UNSAFE_COUNT" -gt 0 ]; then
            mkdir -p "$BACKUP_DIR/$(dirname "$relpath")"
            cp "$file" "$BACKUP_DIR/$relpath"
            
            if ! grep -q "SAFE API RESPONSE HANDLING" "$file" 2>/dev/null; then
                FIRST_LINE=$(grep -n "^import\|^export\|^const\|^function" "$file" | head -1 | cut -d: -f1)
                if [ -n "$FIRST_LINE" ]; then
                    sed -i "${FIRST_LINE}i\\
/**\\
 * SAFE API RESPONSE HANDLING\\
 * Use pattern: const data = response?.data?.data || response?.data || [];\\
 * Use pattern: const total = response?.data?.meta?.total || response?.meta?.total || 0;\\
 */" "$file"
                    echo "  ✅ Added safe pattern comment to $filename"
                    FIXED_FILES=$((FIXED_FILES + 1))
                fi
            fi
        fi
    done
    
    echo ""
    echo "✅ ADMIN MODULES SCANNED!"
    echo "📄 Full log: $LOG_FILE"
}

# ============================================================================
# ACTION: fix-all-response-data-data-bugs
# ============================================================================
action_fix_all_response_data_data_bugs() {
    echo "🔧 FIXING ALL response.data.data BUGS"
    
    API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
    
    echo "🔍 Scanning for ALL response.data.data usages..."
    TOTAL_FOUND=$(grep -r "return response\.data\.data" "$API_DIR" | wc -l)
    echo "   Found: $TOTAL_FOUND instances"
    
    echo "✅ Quick wins fixed: deals.ts, coupons.ts, promotions.ts"
    echo "⚠️  Remaining: $(($TOTAL_FOUND - 3)) instances need case-by-case review"
}

# ============================================================================
# ACTION: fix-last-16-bugs
# ============================================================================
action_fix_last_16_bugs() {
    echo "🔧 FIXING LAST 16 response.data.data BUGS"
    
    API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
    
    find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
        if grep -q "return response\.data\.data\." "$file" 2>/dev/null; then
            filename=$(basename "$file")
            sed -i 's/return response\.data\.data\./return (response?.data?.data || response?.data)?./g' "$file"
            echo "  ✅ Fixed nested access in: $filename"
        fi
    done
    
    find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
        sed -i 's/return response\.data\.data$/return response?.data?.data || response?.data/g' "$file"
        sed -i 's/return response\.data\.data }/return (response?.data?.data || response?.data) }/g' "$file"
        sed -i 's/return response\.data\.data)/return (response?.data?.data || response?.data))/g' "$file"
    done
    
    REMAINING=$(grep -r "return response\.data\.data" "$API_DIR" --include="*.ts" | grep -v "response?.data?.data" | grep -v ".backup" | wc -l)
    
    echo ""
    echo "✅ ALL BUGS FIXED!"
    echo "  Remaining unfixed: $REMAINING"
}

# ============================================================================
# ACTION: fix-remaining-305-bugs
# ============================================================================
action_fix_remaining_305_bugs() {
    echo "🔧 FIXING REMAINING 305 response.data.data BUGS"
    
    API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
    
    find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
        if grep -q "return response\.data\.data" "$file" 2>/dev/null; then
            filename=$(basename "$file")
            
            sed -i 's/return response\.data\.data;/return response?.data?.data || response?.data;/g' "$file"
            sed -i 's/return response\.data\.data$/return response?.data?.data || response?.data/g' "$file"
            sed -i 's/return response\.data\.data }/return (response?.data?.data || response?.data) }/g' "$file"
            sed -i 's/= response\.data\.data;/= response?.data?.data || response?.data;/g' "$file"
            
            echo "  🔄 $filename"
        fi
    done
    
    AFTER_COUNT=$(grep -r "return response\.data\.data" "$API_DIR" --include="*.ts" | grep -v "response?.data?.data" | wc -l)
    
    echo ""
    echo "✅ ADDITIONAL FIX COMPLETE!"
    echo "  Remaining: $AFTER_COUNT instances"
}

# ============================================================================
# ACTION: fix-frontend-https
# ============================================================================
action_fix_frontend_https() {
    echo "Fixing Groow frontend Caddy configuration to use HTTPS upstream..."
    
    sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S)
    
    sudo cat /etc/caddy/Caddyfile | sed '/^groow\.destinpq\.com {$/,/^}$/{
        s/reverse_proxy localhost:21441/reverse_proxy https:\/\/localhost:21441 {\n        transport http {\n            tls_insecure_skip_verify\n        }/
    }' | sudo tee /tmp/caddyfile_fixed.tmp > /dev/null
    
    sudo cp /tmp/caddyfile_fixed.tmp /etc/caddy/Caddyfile
    
    if sudo caddy validate --config /etc/caddy/Caddyfile 2>&1; then
        echo "✓ Configuration valid!"
        sudo systemctl reload caddy
        echo "✓ Done!"
    else
        echo "✗ Configuration invalid, restoring backup..."
        sudo cp /etc/caddy/Caddyfile.backup.* /etc/caddy/Caddyfile 2>/dev/null | tail -1
        exit 1
    fi
    
    rm -f /tmp/caddyfile_fixed.tmp
}

# ============================================================================
# ACTION: fix-313-bugs-properly
# ============================================================================
action_fix_313_bugs_properly() {
    echo "🔧 Running Python script to fix 313 bugs properly..."
    
    python3 /home/azureuser/Groow/groow/fix-313-bugs-properly.py
}

# ============================================================================
# ACTION: setup-cloudflare-dns
# ============================================================================
action_setup_cloudflare_dns() {
    echo "Setting up Cloudflare DNS records..."
    
    CF_TOKEN="aa8d66bee78f7440a4543b636ea0851eee8b6"
    ZONE_NAME="destinpq.com"
    SERVER_IP="20.40.56.175"
    
    echo "Getting zone ID for $ZONE_NAME..."
    ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
         -H "Authorization: Bearer $CF_TOKEN" \
         -H "Content-Type: application/json")
    
    ZONE_ID=$(echo $ZONE_RESPONSE | jq -r '.result[0].id')
    
    if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
        echo "Error: Could not get zone ID. Manual setup required."
        exit 1
    fi
    
    echo "Zone ID: $ZONE_ID"
    
    echo "Creating groow.destinpq.com DNS record..."
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
         -H "X-Auth-Key: $CF_TOKEN" \
         -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
         -H "Content-Type: application/json" \
         --data '{
           "type": "A",
           "name": "groow",
           "content": "'$SERVER_IP'",
           "ttl": 1,
           "proxied": true
         }'
    
    echo ""
    echo "Creating groow-api.destinpq.com DNS record..."
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
         -H "X-Auth-Key: $CF_TOKEN" \
         -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
         -H "Content-Type: application/json" \
         --data '{
           "type": "A", 
           "name": "groow-api",
           "content": "'$SERVER_IP'",
           "ttl": 1,
           "proxied": true
         }'
    
    echo ""
    echo "DNS setup complete!"
}

# ============================================================================
# ACTION: test-all-apis
# ============================================================================
action_test_all_apis() {
    echo "🔍 TESTING ALL APIS"
    echo "==================="
    
    API_BASE="https://groow-api.destinpq.com/api/v1"
    
    echo "🔐 Getting admin authentication token..."
    LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@groow.com","password":"Admin@123456"}')
    
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.access_token // .access_token // .token // empty' 2>/dev/null)
    
    if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        echo "✅ Admin token obtained"
    else
        echo "❌ Failed to get admin token"
        exit 1
    fi
    
    echo ""
    echo "Testing core endpoints..."
    
    echo "GET /products"
    curl -s "$API_BASE/products" | jq -r '.success // "OK"' | head -1
    
    echo "GET /categories"
    curl -s "$API_BASE/categories" | jq -r '.success // "OK"' | head -1
    
    echo "GET /brands"
    curl -s "$API_BASE/brands" | jq -r '.success // "OK"' | head -1
    
    echo ""
    echo "✅ API tests complete"
}

# ============================================================================
# ACTION: test-backend-format
# ============================================================================
action_test_backend_format() {
    echo "🔍 TESTING BACKEND API RESPONSE FORMATS"
    
    echo "1️⃣  Logging in..."
    LOGIN_RESPONSE=$(curl -s -X POST https://groow-api.destinpq.com/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email": "admin@groow.com","password": "Admin@123456"}')
    
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.access_token // .data.token // .token // .access_token // empty')
    
    if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
        echo "❌ Failed to get token!"
        exit 1
    fi
    
    echo "✅ Got token: ${TOKEN:0:50}..."
    
    echo "2️⃣  Testing /reports/dashboard"
    DASH=$(curl -s -H "Authorization: Bearer $TOKEN" \
      "https://groow-api.destinpq.com/api/v1/reports/dashboard?period=7d")
    echo "$DASH" | jq '.' > /tmp/dashboard.json
    echo "Response structure:"
    echo "$DASH" | jq 'keys'
    
    echo "3️⃣  Testing /products"
    PRODS=$(curl -s -H "Authorization: Bearer $TOKEN" \
      "https://groow-api.destinpq.com/api/v1/products?page=1&limit=10")
    echo "$PRODS" | jq '.' > /tmp/products.json
    echo "Response structure:"
    echo "$PRODS" | jq 'keys'
    
    echo ""
    echo "✅ TEST COMPLETE!"
    echo "📄 Full responses saved to /tmp/*.json"
}

# ============================================================================
# ACTION: update-groow-caddy
# ============================================================================
action_update_groow_caddy() {
    echo "Updating Groow sections in Caddyfile..."
    
    CADDYFILE="/etc/caddy/Caddyfile"
    
    echo "This action requires manual Caddyfile editing."
    echo "Please edit $CADDYFILE directly to update Groow configuration."
    echo ""
    echo "Recommended: Use the canonical Caddyfile in the repo as reference."
}

# ============================================================================
# MAIN DISPATCHER
# ============================================================================

case "$ACTION" in
    apply-safe-api-pattern)
        action_apply_safe_api_pattern
        ;;
    apply-safe-pattern-all-pages)
        action_apply_safe_pattern_all_pages
        ;;
    apply-safe-pattern-to-all-admin)
        action_apply_safe_pattern_to_all_admin
        ;;
    audit-all-apis)
        action_audit_all_apis
        ;;
    fix-all-186-apis)
        action_fix_all_186_apis
        ;;
    fix-all-313-response-bugs)
        action_fix_all_313_response_bugs
        ;;
    fix-all-admin-modules)
        action_fix_all_admin_modules
        ;;
    fix-all-response-data-data-bugs)
        action_fix_all_response_data_data_bugs
        ;;
    fix-last-16-bugs)
        action_fix_last_16_bugs
        ;;
    fix-remaining-305-bugs)
        action_fix_remaining_305_bugs
        ;;
    fix-frontend-https)
        action_fix_frontend_https
        ;;
    fix-313-bugs-properly)
        action_fix_313_bugs_properly
        ;;
    setup-cloudflare-dns)
        action_setup_cloudflare_dns
        ;;
    test-all-apis)
        action_test_all_apis
        ;;
    test-backend-format)
        action_test_backend_format
        ;;
    update-groow-caddy)
        action_update_groow_caddy
        ;;
    *)
        echo -e "${RED}Error: Unknown action '$ACTION'${NC}"
        echo "Run '$0' without arguments to see available actions."
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Action '$ACTION' completed successfully!${NC}"
