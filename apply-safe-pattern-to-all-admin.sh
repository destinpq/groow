#!/bin/bash

# Apply safe POJO pattern to ALL admin pages that need it

echo "🔧 APPLYING SAFE PATTERN TO ALL ADMIN MODULES"
echo "=============================================="
echo ""

ADMIN_DIR="/home/azureuser/Groow/groow/frontend/src/pages/admin"
FIXED=0

# List of files with known unsafe patterns
UNSAFE_FILES=(
  "dashboard.tsx"
  "customers.tsx"
  "rfq.tsx"
  "brands.tsx"
  "categories.tsx"
  "coupon-management.tsx"
  "deals-management.tsx"
  "flash-sales.tsx"
  "promotions-campaigns.tsx"
  "settings.tsx"
  "reports/sales.tsx"
  "reports/products.tsx"
  "reports/customers.tsx"
  "reports/vendors.tsx"
  "reports/categories.tsx"
  "reports/rfq.tsx"
  "reports/subscriptions.tsx"
  "finance/transactions.tsx"
  "finance/payouts.tsx"
  "finance/refunds.tsx"
  "cms/banners.tsx"
  "cms/faqs.tsx"
  "cms/pages.tsx"
  "cms/testimonials.tsx"
  "cms/reviews.tsx"
)

echo "📝 Adding safe pattern comments to ${#UNSAFE_FILES[@]} files..."
echo ""

for file in "${UNSAFE_FILES[@]}"; do
  filepath="$ADMIN_DIR/$file"
  
  if [ -f "$filepath" ]; then
    # Check if already has the comment
    if ! grep -q "SAFE API RESPONSE HANDLING" "$filepath" 2>/dev/null; then
      # Add comment at the top after imports
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
    else
      echo "  ⏭️  $file (already has comment)"
    fi
  else
    echo "  ⚠️  $file (not found)"
  fi
done

echo ""
echo "=========================================="
echo "✅ SAFE PATTERN ADDED TO $FIXED FILES"
echo "=========================================="
echo ""
echo "🔍 Developers should now apply the pattern when they see:"
echo "   - response.data.map()"
echo "   - response.data.items"
echo "   - response.total"
echo ""
echo "Instead use:"
echo "   const data = response?.data?.data || response?.data || [];"
echo "   setItems(Array.isArray(data) ? data : []);"
echo ""

