#!/bin/bash

echo "🔧 FIXING ALL 313 response.data.data BUGS"
echo "=========================================="
echo ""

API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
BACKUP_DIR="/home/azureuser/Groow/groow/frontend/src/services/api/.backup-response-fix-$(date +%Y%m%d-%H%M%S)"

# Create backup
mkdir -p "$BACKUP_DIR"
echo "📦 Creating backup: $BACKUP_DIR"

# Count before
BEFORE_COUNT=$(grep -r "return response\.data\.data" "$API_DIR" --include="*.ts" | wc -l)
echo "📊 Found $BEFORE_COUNT instances of 'return response.data.data'"
echo ""

echo "🔄 Applying universal fix..."
echo ""

# Find all .ts files with the pattern
FIXED_FILES=0
find "$API_DIR" -name "*.ts" -type f ! -name "client.ts" ! -name "index.ts" | while read -r file; do
  if grep -q "return response\.data\.data" "$file" 2>/dev/null; then
    filename=$(basename "$file")
    
    # Backup
    cp "$file" "$BACKUP_DIR/"
    
    # Universal fix: response.data.data || response.data
    # This handles BOTH:
    #   - Nested format: {success, data: {data: [...], meta: {}}}
    #   - Simple format: {success, data: {...}}
    
    sed -i 's/return response\.data\.data;/return response?.data?.data || response?.data;/g' "$file"
    
    echo "  ✅ Fixed: $filename"
    FIXED_FILES=$((FIXED_FILES + 1))
  fi
done

# Count after
AFTER_COUNT=$(grep -r "return response\.data\.data;" "$API_DIR" --include="*.ts" | wc -l)
FIXED_TOTAL=$(($BEFORE_COUNT - $AFTER_COUNT))

echo ""
echo "=========================================="
echo "✅ FIX COMPLETE!"
echo "=========================================="
echo "  Before: $BEFORE_COUNT bugs"
echo "  After:  $AFTER_COUNT bugs"
echo "  Fixed:  $FIXED_TOTAL instances"
echo "  Files:  Check backup for originals"
echo ""
echo "📦 Backup: $BACKUP_DIR"
echo ""
echo "🎯 Universal pattern applied:"
echo "   return response?.data?.data || response?.data;"
echo ""
echo "This works for BOTH formats:"
echo "   - Nested: {success, data: {data: [...]}}"
echo "   - Simple: {success, data: {...}}"
echo ""

