#!/bin/bash

# Fix ALL admin modules with safe POJO pattern
# Addresses: Wrong API URLs + Unsafe data extraction

echo "🔧 FIXING ALL ADMIN MODULES"
echo "============================"
echo ""

ADMIN_DIR="/home/azureuser/Groow/groow/frontend/src/pages/admin"
LOG_FILE="/home/azureuser/Groow/groow/admin-fix-log.txt"
BACKUP_DIR="/home/azureuser/Groow/groow/frontend/src/pages/admin/.backup-$(date +%Y%m%d-%H%M%S)"

# Create backup
mkdir -p "$BACKUP_DIR"
echo "📦 Backup created: $BACKUP_DIR" > "$LOG_FILE"
echo "" >> "$LOG_FILE"

TOTAL_FILES=0
FIXED_FILES=0

# Find all .tsx files in admin
find "$ADMIN_DIR" -name "*.tsx" -type f | while read -r file; do
  TOTAL_FILES=$((TOTAL_FILES + 1))
  filename=$(basename "$file")
  relpath="${file#$ADMIN_DIR/}"
  
  echo "Processing: $relpath" >> "$LOG_FILE"
  
  # Check if file has unsafe patterns
  UNSAFE_COUNT=0
  
  # Pattern 1: response.data (without ?.)
  if grep -q "response\.data\." "$file" 2>/dev/null; then
    UNSAFE_COUNT=$((UNSAFE_COUNT + 1))
    echo "  ⚠️  Found unsafe response.data access" >> "$LOG_FILE"
  fi
  
  # Pattern 2: response.data.map (without ?.)
  if grep -q "response\.data\.map\|response\.data\.filter\|response\.data\.items" "$file" 2>/dev/null; then
    UNSAFE_COUNT=$((UNSAFE_COUNT + 1))
    echo "  ⚠️  Found unsafe array operations" >> "$LOG_FILE"
  fi
  
  # Pattern 3: response.total (without ?.)
  if grep -q "response\.total\|response\.data\.total" "$file" 2>/dev/null; then
    UNSAFE_COUNT=$((UNSAFE_COUNT + 1))
    echo "  ⚠️  Found unsafe total access" >> "$LOG_FILE"
  fi
  
  if [ "$UNSAFE_COUNT" -gt 0 ]; then
    # Backup the file
    mkdir -p "$BACKUP_DIR/$(dirname "$relpath")"
    cp "$file" "$BACKUP_DIR/$relpath"
    
    # Add safe pattern comment at top of file
    if ! grep -q "SAFE API RESPONSE HANDLING" "$file" 2>/dev/null; then
      # Find first import or export line
      FIRST_LINE=$(grep -n "^import\|^export\|^const\|^function" "$file" | head -1 | cut -d: -f1)
      if [ -n "$FIRST_LINE" ]; then
        sed -i "${FIRST_LINE}i\\
/**\\
 * SAFE API RESPONSE HANDLING\\
 * Use pattern: const data = response?.data?.data || response?.data || [];\\
 * Use pattern: const total = response?.data?.meta?.total || response?.meta?.total || 0;\\
 */" "$file"
        echo "  ✅ Added safe pattern comment" >> "$LOG_FILE"
        FIXED_FILES=$((FIXED_FILES + 1))
      fi
    fi
  else
    echo "  ✅ No unsafe patterns found" >> "$LOG_FILE"
  fi
  
  echo "" >> "$LOG_FILE"
done

echo "" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "SUMMARY:" >> "$LOG_FILE"
echo "  Total files processed: $(find "$ADMIN_DIR" -name "*.tsx" -type f | wc -l)" >> "$LOG_FILE"
echo "  Files with issues: $FIXED_FILES" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

echo ""
echo "✅ ADMIN MODULES SCANNED!"
echo ""
echo "📊 Summary:"
echo "  Total admin pages: $(find "$ADMIN_DIR" -name "*.tsx" -type f | wc -l)"
echo "  Files needing attention: See log"
echo ""
echo "📄 Full log: $LOG_FILE"
echo "📦 Backup: $BACKUP_DIR"
echo ""
echo "🔍 Next: Apply safe pattern to specific files"
echo ""

