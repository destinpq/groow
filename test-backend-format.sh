#!/bin/bash
echo "🔍 TESTING BACKEND API RESPONSE FORMATS"
echo "========================================"

# Login to get token
echo "1️⃣  Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST https://groow-api.destinpq.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@groow.com",
    "password": "Admin@123456"
  }')

# Extract token - TRY ALL POSSIBLE LOCATIONS
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.access_token // .data.token // .token // .access_token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Failed to get token!"
  echo "Login response structure:"
  echo "$LOGIN_RESPONSE" | jq 'keys'
  exit 1
fi

echo "✅ Got token: ${TOKEN:0:50}..."
echo ""

# Test each endpoint
echo "2️⃣  Testing /reports/dashboard"
DASH=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://groow-api.destinpq.com/api/v1/reports/dashboard?period=7d")
echo "$DASH" | jq '.' > /tmp/dashboard.json
echo "Response structure:"
echo "$DASH" | jq 'keys'
echo "Data location:" 
echo "$DASH" | jq -r 'if .data.data then ".data.data" elif .data then ".data" else "root" end'
echo ""

echo "3️⃣  Testing /products"
PRODS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://groow-api.destinpq.com/api/v1/products?page=1&limit=10")
echo "$PRODS" | jq '.' > /tmp/products.json
echo "Response structure:"
echo "$PRODS" | jq 'keys'
echo "Data location:"
echo "$PRODS" | jq -r 'if .data.data then ".data.data (array)" elif .data then ".data" else "root" end'
echo ""

echo "4️⃣  Testing /orders"
ORDERS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://groow-api.destinpq.com/api/v1/orders?page=1&limit=10")
echo "$ORDERS" | jq '.' > /tmp/orders.json
echo "Response structure:"
echo "$ORDERS" | jq 'keys'
echo "Data location:"
echo "$ORDERS" | jq -r 'if .data.data then ".data.data" elif .data then ".data" else "root" end'
echo ""

echo "5️⃣  Testing /deals/stats"
DEALS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://groow-api.destinpq.com/api/v1/deals/stats")
echo "$DEALS" | jq '.' > /tmp/deals.json
echo "Response structure:"
echo "$DEALS" | jq 'keys'
echo ""

echo "════════════════════════════════════════"
echo "✅ TEST COMPLETE!"
echo ""
echo "📄 Full responses saved to /tmp/*.json"
echo ""
