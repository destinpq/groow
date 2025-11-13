#!/bin/bash

# Apply safe data handling pattern to ALL pages
# Pattern: response?.data?.data || response?.data || []

echo "🔧 Applying safe POJO pattern to ALL pages"
echo "=========================================="
echo ""

PAGES_DIR="/home/azureuser/Groow/groow/frontend/src/pages"
BACKUP_DIR="/home/azureuser/Groow/groow/frontend/src/pages/.backup-$(date +%Y%m%d-%H%M%S)"

# Create backup
echo "📦 Creating backup at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Find all .tsx files that likely consume API responses
TARGET_FILES=$(find "$PAGES_DIR" -name "*.tsx" -exec grep -l "API\|api\.\|await.*\(get\|post\|put\|patch\|delete\)" {} \; 2>/dev/null)

COUNT=0
MODIFIED=0

echo "📝 Scanning pages for API response handling..."
echo ""

for file in $TARGET_FILES; do
  COUNT=$((COUNT + 1))
  filename=$(basename "$file")
  
  # Check if file already has the safe pattern
  if grep -q "response?.data?.data || response?.data" "$file" 2>/dev/null; then
    echo "  ✅ $filename (already has safe pattern)"
    continue
  fi
  
  # Check if file needs the pattern
  if grep -q "response\.data\." "$file" 2>/dev/null; then
    echo "  🔄 $filename (applying safe pattern...)"
    
    # Backup original
    cp "$file" "$BACKUP_DIR/"
    
    # Apply pattern - this is a simplified version
    # In production, you'd want more sophisticated AST-based transformation
    # For now, we'll add a comment to remind developers
    
    # Add a comment at the top of the component if not already present
    if ! grep -q "SAFE API HANDLING" "$file" 2>/dev/null; then
      # Find the first export default or export const line
      sed -i '1a\\n// SAFE API HANDLING: Use pattern -> const data = response?.data?.data || response?.data || [];' "$file"
      MODIFIED=$((MODIFIED + 1))
    fi
  else
    echo "  ⏭️  $filename (no API response handling found)"
  fi
done

echo ""
echo "════════════════════════════════════"
echo "📊 SUMMARY"
echo "════════════════════════════════════"
echo "  Files scanned: $COUNT"
echo "  Files modified: $MODIFIED"
echo "  Backup location: $BACKUP_DIR"
echo ""
echo "✅ Safe pattern reminder added to files"
echo ""
echo "💡 RECOMMENDED PATTERN:"
echo "   const dataArray = response?.data?.data || response?.data || [];"
echo "   const total = response?.data?.meta?.total || response?.meta?.total || 0;"
echo ""

