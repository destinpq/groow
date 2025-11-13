#!/bin/bash

# Script to apply safe API response handling pattern to all frontend pages
# This ensures: const data = response?.data?.data || response?.data || [];

echo "🔧 Applying safe API response handling to all pages..."

cd /home/azureuser/Groow/groow/frontend/src/pages

# Find all .tsx files and apply the pattern
find . -name "*.tsx" -type f | while read file; do
    # Skip if file doesn't contain await or API calls
    if grep -q "await.*API\|response\.data" "$file"; then
        echo "Processing: $file"
        
        # Create backup
        cp "$file" "$file.backup"
        
        # Apply defensive patterns (using perl for more complex replacements)
        perl -i -pe '
            # Pattern 1: setXXX(response.data) -> safe extraction
            s/set(\w+)\(response\.data\)/set$1(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []))/g;
            
            # Pattern 2: const data = response.data -> safe extraction
            s/const\s+(\w+)\s*=\s*response\.data(?!\.)/const $1 = response?.data?.data || response?.data || []/g;
            
            # Pattern 3: Handle non-array responses
            s/const\s+(\w+)\s*=\s*response\.data\.data/const $1 = response?.data?.data || response?.data || null/g;
        ' "$file"
        
        # Check if file was actually modified
        if ! diff -q "$file" "$file.backup" > /dev/null 2>&1; then
            echo "  ✅ Updated: $file"
        else
            # No changes, restore original
            mv "$file.backup" "$file"
        fi
    fi
done

echo ""
echo "✅ Safe API pattern applied to all pages!"
echo ""
echo "Pattern applied:"
echo "  const data = response?.data?.data || response?.data || [];"
echo ""

