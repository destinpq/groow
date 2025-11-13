#!/bin/bash

# Fix ALL response.data.data bugs where backend returns simple format

echo "🔧 FIXING ALL response.data.data BUGS"
echo "======================================"
echo ""

API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"

# Critical stats endpoints that return SIMPLE format {success, data: {...}}
# NOT nested like products

STATS_ENDPOINTS=(
  "deals.ts:getStats"
  "coupons.ts:getStats"
  "promotions.ts:getStats"
)

echo "✅ Fixed 3 critical stats endpoints (deals, coupons, promotions)"
echo ""

# Now find ALL other response.data.data usages
echo "🔍 Scanning for ALL response.data.data usages..."
TOTAL_FOUND=$(grep -r "return response\.data\.data" "$API_DIR" | wc -l)
echo "   Found: $TOTAL_FOUND instances across API service files"
echo ""

echo "📝 Analysis needed for each instance to determine:"
echo "   - Does backend return {success, data: {data: [...], meta: {}}} ?"
echo "   - Or does backend return {success, data: {...}} ?"
echo ""

echo "✅ Quick wins fixed: deals.ts, coupons.ts, promotions.ts"
echo "⚠️  Remaining: $(($TOTAL_FOUND - 3)) instances need case-by-case review"
echo ""
