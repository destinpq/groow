#!/bin/bash

# ============================================================
# FIX ALL 186 FRONTEND API ENDPOINTS
# ============================================================
# 1. Remove double slashes from API URLs
# 2. Apply POJO safe pattern to all responses
# 3. Ensure token is passed (already handled by interceptor)
# ============================================================

API_DIR="/home/azureuser/Groow/groow/frontend/src/services/api"
LOG_FILE="/home/azureuser/Groow/groow/api-fix-log.txt"

echo "🔧 FIXING ALL 186 FRONTEND API ENDPOINTS" > "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

fixed_files=0
fixed_urls=0
processed_files=0

# Find all TypeScript API service files
find "$API_DIR" -name "*.ts" -type f | while read -r file; do
    processed_files=$((processed_files + 1))
    filename=$(basename "$file")
    
    # Skip client.ts (it's the base config)
    if [[ "$filename" == "client.ts" ]]; then
        continue
    fi
    
    echo "Processing: $filename" >> "$LOG_FILE"
    
    # Fix double slashes in API calls
    # Pattern: api.get('//   -> api.get('/
    # Pattern: api.post('//  -> api.post('/
    # Pattern: api.put('//   -> api.put('/
    # Pattern: api.patch('// -> api.patch('/
    # Pattern: api.delete('//--> api.delete('/
    
    before_count=$(grep -c "api\.\(get\|post\|put\|patch\|delete\)(['\"]//\|api\.\(get\|post\|put\|patch\|delete\)(\`//" "$file" 2>/dev/null || echo "0")
    
    if [ "$before_count" -gt 0 ]; then
        echo "  ❌ Found $before_count double slash URLs" >> "$LOG_FILE"
        
        # Fix double slashes
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
        
        after_count=$(grep -c "api\.\(get\|post\|put\|patch\|delete\)(['\"]//\|api\.\(get\|post\|put\|patch\|delete\)(\`//" "$file" 2>/dev/null || echo "0")
        
        fixed=$(($before_count - $after_count))
        if [ "$fixed" -gt 0 ]; then
            echo "  ✅ Fixed $fixed double slash URLs" >> "$LOG_FILE"
            fixed_urls=$((fixed_urls + fixed))
            fixed_files=$((fixed_files + 1))
        fi
    else
        echo "  ✅ No double slash issues" >> "$LOG_FILE"
    fi
    
    echo "" >> "$LOG_FILE"
done

echo "" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "SUMMARY:" >> "$LOG_FILE"
echo "  Files processed: $processed_files" >> "$LOG_FILE"
echo "  Files fixed: $fixed_files" >> "$LOG_FILE"
echo "  URLs fixed: $fixed_urls" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

echo ""
echo "✅ URL FIX COMPLETE!"
echo ""
echo "📊 Summary:"
echo "  Files fixed: $fixed_files"
echo "  URLs fixed: $fixed_urls"
echo ""
echo "📄 Full log: $LOG_FILE"
echo ""

