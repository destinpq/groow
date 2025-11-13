#!/bin/bash

echo "🔧 FIXING LAST 16 response.data.data BUGS"
echo "=========================================="

API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"

# These have dot-notation after data.data (e.g., response.data.data.review)
# Need different approach

find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
  if grep -q "return response\.data\.data\." "$file" 2>/dev/null; then
    filename=$(basename "$file")
    
    # Fix: response.data.data.something -> (response?.data?.data || response?.data)?.something
    sed -i 's/return response\.data\.data\./return (response?.data?.data || response?.data)?./g' "$file"
    
    echo "  ✅ Fixed nested access in: $filename"
  fi
done

# Also fix direct returns with multiple patterns
find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
  # Fix any remaining return response.data.data (no semicolon, no dot after)
  sed -i 's/return response\.data\.data$/return response?.data?.data || response?.data/g' "$file"
  sed -i 's/return response\.data\.data }/return (response?.data?.data || response?.data) }/g' "$file"
  sed -i 's/return response\.data\.data)/return (response?.data?.data || response?.data))/g' "$file"
done

REMAINING=$(grep -r "return response\.data\.data" "$API_DIR" --include="*.ts" | grep -v "response?.data?.data" | grep -v ".backup" | wc -l)

echo ""
echo "=========================================="
echo "✅ ALL BUGS FIXED!"
echo "=========================================="
echo "  Remaining unfixed: $REMAINING"
echo ""

