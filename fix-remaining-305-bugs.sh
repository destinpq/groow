#!/bin/bash

echo "🔧 FIXING REMAINING 305 response.data.data BUGS"
echo "================================================"
echo ""

API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"

# Find all patterns (with and without semicolon)
echo "🔍 Finding ALL patterns..."
grep -r "return response\.data\.data" "$API_DIR" --include="*.ts" | head -10
echo ""

# Fix ALL variations
find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
  if grep -q "return response\.data\.data" "$file" 2>/dev/null; then
    filename=$(basename "$file")
    
    # Replace ALL variations:
    # - return response.data.data;
    # - return response.data.data
    # - return response.data.data.items
    # etc.
    
    # Method 1: With semicolon (already done)
    sed -i 's/return response\.data\.data;/return response?.data?.data || response?.data;/g' "$file"
    
    # Method 2: Followed by newline/brace
    sed -i 's/return response\.data\.data$/return response?.data?.data || response?.data/g' "$file"
    
    # Method 3: Followed by closing brace
    sed -i 's/return response\.data\.data }/return (response?.data?.data || response?.data) }/g' "$file"
    
    # Method 4: In assignments
    sed -i 's/= response\.data\.data;/= response?.data?.data || response?.data;/g' "$file"
    
    echo "  🔄 $filename"
  fi
done

AFTER_COUNT=$(grep -r "return response\.data\.data" "$API_DIR" --include="*.ts" | grep -v "response?.data?.data" | wc -l)

echo ""
echo "=========================================="
echo "✅ ADDITIONAL FIX COMPLETE!"
echo "=========================================="
echo "  Remaining: $AFTER_COUNT instances"
echo ""

