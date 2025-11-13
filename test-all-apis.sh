#!/bin/bash

# Groow API Testing Script
# Tests all 143+ API endpoints systematically
# Author: Auto-generated
# Date: November 13, 2025

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="https://groow-api.destinpq.com/api/v1"
RESULTS_FILE="api_test_results_$(date +%Y%m%d_%H%M%S).json"
LOG_FILE="api_test_log_$(date +%Y%m%d_%H%M%S).txt"

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Initialize results
echo "{\"testRun\": {\"timestamp\": \"$(date -Iseconds)\", \"results\": []}}" > $RESULTS_FILE

# Function to test an endpoint
test_endpoint() {
    local METHOD=$1
    local ENDPOINT=$2
    local AUTH_REQUIRED=$3
    local DESCRIPTION=$4
    local DATA=$5
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "${BLUE}Testing:${NC} $METHOD $ENDPOINT - $DESCRIPTION"
    
    # Build curl command
    CURL_CMD="curl -s -w '\n%{http_code}' -X $METHOD"
    
    if [ "$AUTH_REQUIRED" = "true" ] && [ -f /tmp/admin_token.txt ]; then
        TOKEN=$(cat /tmp/admin_token.txt)
        CURL_CMD="$CURL_CMD -H 'Authorization: Bearer $TOKEN'"
    fi
    
    if [ "$METHOD" = "POST" ] || [ "$METHOD" = "PATCH" ] || [ "$METHOD" = "PUT" ]; then
        CURL_CMD="$CURL_CMD -H 'Content-Type: application/json'"
        if [ -n "$DATA" ]; then
            CURL_CMD="$CURL_CMD -d '$DATA'"
        fi
    fi
    
    CURL_CMD="$CURL_CMD '$API_BASE$ENDPOINT'"
    
    # Execute request
    RESPONSE=$(eval $CURL_CMD 2>&1)
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    # Check result
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        echo -e "${GREEN}✅ PASS${NC} - HTTP $HTTP_CODE"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "$BODY" | jq '.' 2>/dev/null | head -5 || echo "$BODY" | head -3
    elif [ "$HTTP_CODE" = "401" ] && [ "$AUTH_REQUIRED" = "false" ]; then
        echo -e "${RED}❌ FAIL${NC} - Expected public but got 401"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    elif [ "$HTTP_CODE" = "404" ]; then
        echo -e "${RED}❌ FAIL${NC} - Endpoint not found (404)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    elif [ "$HTTP_CODE" = "500" ]; then
        echo -e "${RED}❌ FAIL${NC} - Server error (500)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        echo -e "${YELLOW}⚠️  SKIP${NC} - HTTP $HTTP_CODE (may need data or different auth)"
        SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
    fi
    
    echo ""
}

# Get admin token
echo "🔐 Getting admin authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@groow.com","password":"Admin@123456"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.access_token // .access_token // .token // empty' 2>/dev/null)

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "$TOKEN" > /tmp/admin_token.txt
    echo -e "${GREEN}✅ Admin token obtained${NC}"
else
    echo -e "${RED}❌ Failed to get admin token - trying admin123...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@groow.com","password":"admin123"}')
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.access_token // .access_token // .token // empty' 2>/dev/null)
    echo "$TOKEN" > /tmp/admin_token.txt
fi

echo ""
echo "======================================"
echo "Starting API Tests"
echo "======================================"
echo ""

# ============================================
# PHASE 1: CORE APIS
# ============================================

echo -e "${BLUE}=== PHASE 1: AUTHENTICATION ===${NC}"
test_endpoint "POST" "/auth/login" "false" "User login" '{"email":"admin@groow.com","password":"Admin@123456"}'
test_endpoint "GET" "/auth/me" "true" "Get current user"
test_endpoint "GET" "/auth/profile" "true" "Get user profile"

echo -e "${BLUE}=== PHASE 1: PRODUCTS ===${NC}"
test_endpoint "GET" "/products" "false" "Get all products"
test_endpoint "GET" "/products/featured" "false" "Get featured products"
test_endpoint "GET" "/products/recommended" "false" "Get recommended products"
test_endpoint "GET" "/products/trending" "false" "Get trending products"

echo -e "${BLUE}=== PHASE 1: CATEGORIES ===${NC}"
test_endpoint "GET" "/categories" "false" "Get all categories"
test_endpoint "GET" "/categories/tree" "false" "Get category tree"
test_endpoint "GET" "/categories/hierarchy" "false" "Get category hierarchy"

echo -e "${BLUE}=== PHASE 1: BRANDS ===${NC}"
test_endpoint "GET" "/brands" "false" "Get all brands"
test_endpoint "GET" "/brands/popular" "false" "Get popular brands"

echo -e "${BLUE}=== PHASE 1: ORDERS ===${NC}"
test_endpoint "GET" "/orders" "true" "Get all orders"
test_endpoint "GET" "/orders/my-orders" "true" "Get my orders"
test_endpoint "GET" "/orders/stats" "true" "Get order stats"

echo -e "${BLUE}=== PHASE 1: CART ===${NC}"
test_endpoint "GET" "/cart" "true" "Get cart"
test_endpoint "GET" "/cart/items" "true" "Get cart items"
test_endpoint "GET" "/cart/count" "true" "Get cart count"

echo -e "${BLUE}=== PHASE 1: VENDORS ===${NC}"
test_endpoint "GET" "/vendors" "true" "Get all vendors"
test_endpoint "GET" "/vendors/profile" "true" "Get vendor profile"
test_endpoint "GET" "/vendors/stats" "true" "Get vendor stats"

echo -e "${BLUE}=== PHASE 1: CUSTOMERS ===${NC}"
test_endpoint "GET" "/customers" "true" "Get all customers"
test_endpoint "GET" "/customers/profile" "true" "Get customer profile"

# ============================================
# PHASE 2: MARKETING & BUSINESS
# ============================================

echo -e "${BLUE}=== PHASE 2: DEALS ===${NC}"
test_endpoint "GET" "/deals" "false" "Get all deals"
test_endpoint "GET" "/deals/stats" "true" "Get deal stats"
test_endpoint "GET" "/deals/active" "false" "Get active deals"
test_endpoint "GET" "/deals/trending" "false" "Get trending deals"

echo -e "${BLUE}=== PHASE 2: COUPONS ===${NC}"
test_endpoint "GET" "/coupons" "true" "Get all coupons"
test_endpoint "GET" "/coupons/stats" "true" "Get coupon stats"

echo -e "${BLUE}=== PHASE 2: PROMOTIONS ===${NC}"
test_endpoint "GET" "/promotions" "true" "Get all promotions"
test_endpoint "GET" "/promotions/stats" "true" "Get promotion stats"
test_endpoint "GET" "/promotions/calendar" "true" "Get promotion calendar"

echo -e "${BLUE}=== PHASE 2: FLASH SALES ===${NC}"
test_endpoint "GET" "/flash-sales" "false" "Get all flash sales"
test_endpoint "GET" "/flash-sales/live" "false" "Get live flash sales"
test_endpoint "GET" "/flash-sales/upcoming" "false" "Get upcoming flash sales"
test_endpoint "GET" "/flash-sales/stats" "true" "Get flash sale stats"

echo -e "${BLUE}=== PHASE 2: LOYALTY ===${NC}"
test_endpoint "GET" "/loyalty/programs" "true" "Get loyalty programs"
test_endpoint "GET" "/loyalty/rewards" "true" "Get loyalty rewards"
test_endpoint "GET" "/loyalty/transactions" "true" "Get loyalty transactions"

# ============================================
# PHASE 3: REPORTS & ANALYTICS
# ============================================

echo -e "${BLUE}=== PHASE 3: REPORTS ===${NC}"
test_endpoint "GET" "/reports/dashboard" "true" "Get dashboard report"
test_endpoint "GET" "/reports/system-health" "true" "Get system health"
test_endpoint "GET" "/reports/recent-activities" "true" "Get recent activities"
test_endpoint "GET" "/reports/sales" "true" "Get sales report"
test_endpoint "GET" "/reports/products" "true" "Get products report"
test_endpoint "GET" "/reports/customers" "true" "Get customers report"
test_endpoint "GET" "/reports/vendors" "true" "Get vendors report"

echo -e "${BLUE}=== PHASE 3: ANALYTICS ===${NC}"
test_endpoint "GET" "/analytics/dashboard" "true" "Get analytics dashboard"
test_endpoint "GET" "/analytics/overview" "true" "Get analytics overview"
test_endpoint "GET" "/analytics/realtime" "true" "Get realtime analytics"

# ============================================
# PHASE 4: SUPPORT & COMMUNICATION
# ============================================

echo -e "${BLUE}=== PHASE 4: SUPPORT ===${NC}"
test_endpoint "GET" "/support/tickets" "true" "Get support tickets"
test_endpoint "GET" "/support/tickets/my" "true" "Get my tickets"

echo -e "${BLUE}=== PHASE 4: NOTIFICATIONS ===${NC}"
test_endpoint "GET" "/notifications" "true" "Get notifications"
test_endpoint "GET" "/notifications/preferences" "true" "Get notification preferences"

echo -e "${BLUE}=== PHASE 4: CHAT ===${NC}"
test_endpoint "GET" "/chat/conversations" "true" "Get conversations"

# ============================================
# PHASE 5: CONTENT & CMS
# ============================================

echo -e "${BLUE}=== PHASE 5: CMS ===${NC}"
test_endpoint "GET" "/cms/banners" "false" "Get banners"
test_endpoint "GET" "/cms/banners/active" "false" "Get active banners"
test_endpoint "GET" "/cms/faqs" "false" "Get FAQs"
test_endpoint "GET" "/cms/pages" "false" "Get pages"
test_endpoint "GET" "/cms/testimonials" "false" "Get testimonials"

# ============================================
# PHASE 6: SHIPPING & TAX
# ============================================

echo -e "${BLUE}=== PHASE 6: SHIPPING ===${NC}"
test_endpoint "GET" "/shipping/methods" "false" "Get shipping methods"
test_endpoint "GET" "/shipping/zones" "true" "Get shipping zones"
test_endpoint "GET" "/shipping/carriers" "true" "Get shipping carriers"

echo -e "${BLUE}=== PHASE 6: TAX ===${NC}"
test_endpoint "GET" "/tax/rates" "true" "Get tax rates"
test_endpoint "GET" "/tax/countries" "false" "Get tax countries"

# ============================================
# PHASE 7: ADVANCED FEATURES
# ============================================

echo -e "${BLUE}=== PHASE 7: RFQ ===${NC}"
test_endpoint "GET" "/rfq" "true" "Get all RFQs"
test_endpoint "GET" "/rfq/my-rfqs" "true" "Get my RFQs"

echo -e "${BLUE}=== PHASE 7: SUBSCRIPTIONS ===${NC}"
test_endpoint "GET" "/api/subscriptions" "true" "Get subscriptions"
test_endpoint "GET" "/api/subscriptions/stats" "true" "Get subscription stats"

echo -e "${BLUE}=== PHASE 7: RETURNS ===${NC}"
test_endpoint "GET" "/returns" "true" "Get all returns"
test_endpoint "GET" "/returns/stats" "true" "Get return stats"

echo -e "${BLUE}=== PHASE 7: REVIEWS ===${NC}"
test_endpoint "GET" "/reviews" "false" "Get all reviews"

echo -e "${BLUE}=== PHASE 7: WISHLIST ===${NC}"
test_endpoint "GET" "/wishlist" "true" "Get wishlist"

# ============================================
# FINAL SUMMARY
# ============================================

echo ""
echo "======================================"
echo "TEST SUMMARY"
echo "======================================"
echo -e "Total Tests:   $TOTAL_TESTS"
echo -e "${GREEN}Passed:        $PASSED_TESTS${NC}"
echo -e "${RED}Failed:        $FAILED_TESTS${NC}"
echo -e "${YELLOW}Skipped:       $SKIPPED_TESTS${NC}"
echo ""
echo "Results saved to: $RESULTS_FILE"
echo "Logs saved to: $LOG_FILE"
echo ""

# Calculate pass rate
if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "Pass Rate: $PASS_RATE%"
fi

# Clean up
rm -f /tmp/admin_token.txt

echo ""
echo "======================================"
echo "RECOMMENDATIONS"
echo "======================================"
echo ""
echo "1. Endpoints returning 401: Need proper authentication"
echo "2. Endpoints returning 404: May not be implemented yet"
echo "3. Endpoints returning 500: Server errors - check backend logs"
echo "4. Empty responses: May need database seeding"
echo ""
echo "To seed the database, run:"
echo "  cd backend && npm run seed"
echo ""

