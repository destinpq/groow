# Groow E-Commerce Platform - Test Cases for Manual Testers
## Comprehensive Testing Guide

**Version:** 1.0  
**Date:** November 13, 2025  
**Platform:** groow.destinpq.com | groow-api.destinpq.com  
**Status:** Production Testing

---

# TABLE OF CONTENTS

1. [Test Environment Setup](#test-environment-setup)
2. [Test Credentials](#test-credentials)
3. [Core E-Commerce Test Cases](#core-e-commerce-test-cases)
4. [Admin Portal Test Cases](#admin-portal-test-cases)
5. [Vendor Portal Test Cases](#vendor-portal-test-cases)
6. [Customer Portal Test Cases](#customer-portal-test-cases)
7. [API Test Cases](#api-test-cases)
8. [Test Execution Guide](#test-execution-guide)
9. [Bug Reporting Template](#bug-reporting-template)

---

# TEST ENVIRONMENT SETUP

## URLs
- **Frontend:** https://groow.destinpq.com
- **Backend API:** https://groow-api.destinpq.com
- **API Documentation:** https://groow-api.destinpq.com/api/docs
- **Health Check:** https://groow-api.destinpq.com/api/v1/health

## Browsers to Test
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)

## Test Data
- Pre-seeded database with:
  - 10 Categories
  - 15 Brands
  - 6+ Products
  - 10 Customers
  - 5 Vendors
  - 5 Deals, 5 Coupons, 5 Promotions

---

# TEST CREDENTIALS

## Admin User
- **Email:** admin@groow.com
- **Password:** Admin@123456
- **Access:** Full system access
- **Dashboard:** /admin/dashboard

## Vendor Users (5 accounts)
- **Emails:** vendor1@groow.com through vendor5@groow.com
- **Password:** Vendor@123456
- **Dashboard:** /vendor/dashboard

## Customer Users (10 accounts)
- **Emails:** customer1@groow.com through customer10@groow.com
- **Password:** Customer@123456
- **Dashboard:** /customer/dashboard

---

# CORE E-COMMERCE TEST CASES

## TC-001: User Registration

**Priority:** High  
**Module:** Authentication  
**Test Type:** Functional

### Prerequisites:
- None

### Steps:
1. Navigate to https://groow.destinpq.com/register
2. Fill in registration form:
   - Email: testuser[timestamp]@groow.com
   - Password: Test@123456
   - First Name: Test
   - Last Name: User
   - Role: Customer
3. Click "Register" button
4. Verify success message appears
5. Verify email verification link sent (check logs)

### Expected Result:
- ✅ Registration successful
- ✅ User created in database
- ✅ Redirect to login or dashboard
- ✅ Welcome email sent

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-002: User Login

**Priority:** Critical  
**Module:** Authentication  
**Test Type:** Functional

### Prerequisites:
- Valid user account exists

### Steps:
1. Navigate to https://groow.destinpq.com/login
2. Enter credentials:
   - Email: admin@groow.com
   - Password: Admin@123456
3. Click "Login" button
4. Wait for page to load

### Expected Result:
- ✅ Login successful (HTTP 200)
- ✅ Token generated and stored
- ✅ Redirect to appropriate dashboard (admin → /admin/dashboard)
- ✅ User profile loaded

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-003: Browse Products

**Priority:** Critical  
**Module:** Products  
**Test Type:** Functional

### Prerequisites:
- Products exist in database
- User logged in (optional)

### Steps:
1. Navigate to https://groow.destinpq.com/products
2. Verify product list displays
3. Check product cards show:
   - Product image
   - Product name
   - Price
   - Stock status
4. Click on a product
5. Verify product detail page loads

### Expected Result:
- ✅ Product list loads (GET /products returns 200)
- ✅ All products display correctly
- ✅ Product details accessible
- ✅ Images load properly

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-004: Add to Cart

**Priority:** Critical  
**Module:** Shopping Cart  
**Test Type:** Functional

### Prerequisites:
- User logged in as customer
- Products available

### Steps:
1. Navigate to product detail page
2. Click "Add to Cart" button
3. Verify item added to cart
4. Check cart icon shows item count
5. Navigate to cart page (/cart)
6. Verify product appears in cart

### Expected Result:
- ✅ Item added successfully (POST /cart returns 200)
- ✅ Cart count updates
- ✅ Cart page shows correct items
- ✅ Price calculated correctly

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-005: Update Cart Quantity

**Priority:** High  
**Module:** Shopping Cart  
**Test Type:** Functional

### Prerequisites:
- Customer logged in
- Item in cart

### Steps:
1. Navigate to cart page
2. Change quantity using +/- buttons
3. Verify quantity updates
4. Verify total price updates
5. Test edge cases:
   - Minimum quantity (1)
   - Maximum available stock

### Expected Result:
- ✅ Quantity updates correctly
- ✅ Price recalculates
- ✅ Stock limits enforced
- ✅ API call successful (PATCH /cart/items/:id)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-006: Remove from Cart

**Priority:** High  
**Module:** Shopping Cart  
**Test Type:** Functional

### Prerequisites:
- Customer logged in
- Item in cart

### Steps:
1. Navigate to cart page
2. Click "Remove" button on an item
3. Verify item removed
4. Verify cart total updates
5. If cart empty, verify "Empty cart" message

### Expected Result:
- ✅ Item removed (DELETE /cart/items/:id)
- ✅ Cart updates immediately
- ✅ Total recalculated
- ✅ Empty state shown if no items

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-007: Checkout Process

**Priority:** Critical  
**Module:** Checkout  
**Test Type:** End-to-End

### Prerequisites:
- Customer logged in
- Items in cart
- Shipping address configured

### Steps:
1. Navigate to cart page
2. Click "Proceed to Checkout"
3. Verify checkout page loads
4. Review order summary
5. Select shipping method
6. Select payment method
7. Review and confirm order
8. Click "Place Order"

### Expected Result:
- ✅ Checkout page loads
- ✅ Order summary correct
- ✅ Payment options available
- ✅ Order created (POST /orders)
- ✅ Order confirmation shown
- ✅ Order number generated

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-008: View Order History

**Priority:** High  
**Module:** Orders  
**Test Type:** Functional

### Prerequisites:
- Customer logged in
- At least one order placed

### Steps:
1. Navigate to customer dashboard
2. Click "My Orders"
3. Verify order list displays
4. Click on an order
5. Verify order details page

### Expected Result:
- ✅ Order list loads (GET /orders/my-orders)
- ✅ All orders displayed
- ✅ Order details accessible
- ✅ Status shown correctly

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

# ADMIN PORTAL TEST CASES

## TC-101: Admin Dashboard

**Priority:** Critical  
**Module:** Admin Dashboard  
**Test Type:** Functional

### Prerequisites:
- Logged in as admin

### Steps:
1. Login as admin
2. Navigate to /admin/dashboard
3. Verify dashboard loads
4. Check all widgets display:
   - Total Revenue
   - Total Orders
   - Active Customers
   - Active Services
5. Verify charts render
6. Check system health indicator

### Expected Result:
- ✅ Dashboard loads successfully
- ✅ All statistics display
- ✅ Charts render correctly
- ✅ No JavaScript errors
- ✅ Data fetched from APIs (GET /reports/dashboard)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-102: Manage Products

**Priority:** Critical  
**Module:** Product Management  
**Test Type:** CRUD

### Test 102a: List Products
1. Navigate to /admin/products
2. Verify product table loads
3. Check pagination works
4. Test search functionality
5. Test filters

**Expected:** All products displayed, search/filter works

### Test 102b: Create Product
1. Click "Add Product" button
2. Fill form:
   - Name: Test Product
   - Description: Test Description
   - Price: 99.99
   - Stock: 100
   - Category: Select one
   - Brand: Select one
3. Upload product image
4. Click "Save"

**Expected:** Product created (POST /products returns 200), appears in list

### Test 102c: Edit Product
1. Click "Edit" on a product
2. Change product name
3. Update price
4. Click "Save"

**Expected:** Product updated (PATCH /products/:id returns 200)

### Test 102d: Delete Product
1. Click "Delete" on a product
2. Confirm deletion
3. Verify product removed from list

**Expected:** Product deleted (DELETE /products/:id returns 200)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-103: Manage Categories

**Priority:** High  
**Module:** Category Management  
**Test Type:** CRUD

### Test 103a: List Categories
1. Navigate to /admin/categories
2. Verify category list displays
3. Check hierarchy view

### Test 103b: Create Category
1. Click "Add Category"
2. Fill form:
   - Name: Test Category
   - Description: Test Description
   - Parent: (optional)
3. Click "Save"

**Expected:** Category created (POST /categories)

### Test 103c: Edit Category
1. Click "Edit" on a category
2. Update name
3. Click "Save"

**Expected:** Category updated (PATCH /categories/:id)

### Test 103d: Delete Category
1. Click "Delete" on a category
2. Confirm deletion

**Expected:** Category deleted (DELETE /categories/:id)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-104: Manage Orders

**Priority:** Critical  
**Module:** Order Management  
**Test Type:** Functional

### Test 104a: View All Orders
1. Navigate to /admin/orders
2. Verify orders table displays
3. Check all columns visible:
   - Order Number
   - Customer
   - Date
   - Status
   - Total
4. Test pagination

**Expected:** Orders list loads (GET /orders)

### Test 104b: View Order Details
1. Click on an order
2. Verify details page loads
3. Check all information displayed:
   - Order items
   - Customer info
   - Shipping address
   - Payment status

**Expected:** Order details load (GET /orders/:id)

### Test 104c: Update Order Status
1. Open order details
2. Change status dropdown
3. Select new status
4. Click "Update"

**Expected:** Status updated (PATCH /orders/:id/status)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-105: Marketing - Deals Management

**Priority:** High  
**Module:** Marketing  
**Test Type:** CRUD

### Test 105a: List Deals
1. Navigate to /admin/deals-management
2. Verify deals list displays

**Expected:** GET /deals returns 200

### Test 105b: Create Deal
1. Click "Create Deal"
2. Fill form:
   - Title: Flash Sale
   - Description: 50% Off
   - Discount: 50%
   - Start Date: Today
   - End Date: +7 days
3. Click "Save"

**Expected:** Deal created (POST /deals)

### Test 105c: View Deal Statistics
1. Click "Stats" on a deal
2. Verify statistics display:
   - Views
   - Clicks
   - Conversions
   - Revenue

**Expected:** GET /deals/:id/analytics returns 200

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-106: CMS Management

**Priority:** Medium  
**Module:** Content Management  
**Test Type:** CRUD

### Test 106a: Manage Banners
1. Navigate to /admin/cms/banners
2. Click "Add Banner"
3. Upload image
4. Set title and link
5. Save banner
6. Verify banner appears on homepage

**Expected:** Banner created (POST /cms/banners), displays on site

### Test 106b: Manage FAQs
1. Navigate to /admin/cms/faqs
2. Click "Add FAQ"
3. Enter question and answer
4. Save FAQ
5. Verify FAQ appears in list

**Expected:** FAQ created (POST /cms/faqs)

### Test 106c: Manage Pages
1. Navigate to /admin/cms/pages
2. Click "Add Page"
3. Enter title, slug, content
4. Save page
5. Navigate to page URL
6. Verify content displays

**Expected:** Page created (POST /cms/pages), accessible via URL

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

# VENDOR PORTAL TEST CASES

## TC-201: Vendor Dashboard

**Priority:** High  
**Module:** Vendor Portal  
**Test Type:** Functional

### Prerequisites:
- Logged in as vendor

### Steps:
1. Login as vendor1@groow.com
2. Navigate to /vendor/dashboard
3. Verify dashboard loads
4. Check statistics display:
   - Total Products
   - Total Orders
   - Revenue
   - Pending Orders

### Expected Result:
- ✅ Dashboard loads
- ✅ Stats accurate
- ✅ Charts display
- ✅ API calls successful (GET /vendor/stats)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-202: Vendor Products

**Priority:** High  
**Module:** Vendor Product Management  
**Test Type:** CRUD

### Test 202a: View My Products
1. Navigate to /vendor/products
2. Verify only vendor's products shown

**Expected:** GET /vendor/products returns filtered list

### Test 202b: Add Product
1. Click "Add Product"
2. Fill product details
3. Save product

**Expected:** Product created with vendor association

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-203: Vendor Orders

**Priority:** Critical  
**Module:** Vendor Order Management  
**Test Type:** Functional

### Steps:
1. Navigate to /vendor/orders
2. Verify orders containing vendor's products display
3. Click on an order
4. Update order status
5. Verify status updates

### Expected Result:
- ✅ Vendor sees relevant orders
- ✅ Can update fulfillment status
- ✅ Customer notified of updates

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

# CUSTOMER PORTAL TEST CASES

## TC-301: Customer Profile

**Priority:** High  
**Module:** Customer Portal  
**Test Type:** Functional

### Steps:
1. Login as customer
2. Navigate to /customer/profile
3. Verify profile information displays
4. Click "Edit Profile"
5. Update first name
6. Save changes
7. Verify changes persisted

### Expected Result:
- ✅ Profile loads (GET /customer/profile)
- ✅ Edit form works
- ✅ Updates saved (PATCH /customer/profile)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-302: Manage Addresses

**Priority:** High  
**Module:** Customer Addresses  
**Test Type:** CRUD

### Test 302a: List Addresses
1. Navigate to /customer/addresses
2. Verify address list displays

**Expected:** GET /customer/addresses returns 200

### Test 302b: Add Address
1. Click "Add Address"
2. Fill address form:
   - Street: 123 Test St
   - City: Test City
   - State: TS
   - ZIP: 12345
   - Country: USA
3. Save address

**Expected:** Address created (POST /customer/addresses)

### Test 302c: Set Default Address
1. Click "Set as Default" on an address
2. Verify address marked as default

**Expected:** Default address updated

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-303: Wishlist

**Priority:** Medium  
**Module:** Wishlist  
**Test Type:** Functional

### Steps:
1. Login as customer
2. Browse products
3. Click "Add to Wishlist" on a product
4. Navigate to /customer/wishlist
5. Verify product appears
6. Click "Move to Cart"
7. Verify item moved to cart

### Expected Result:
- ✅ Wishlist functions work
- ✅ Items persist
- ✅ Can move to cart
- ✅ APIs work (GET/POST /customer/wishlist)

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

# API TEST CASES

## TC-401: Authentication APIs

**Priority:** Critical  
**Module:** Auth API  
**Test Type:** API

### Test 401a: POST /auth/login
```bash
curl -X POST https://groow-api.destinpq.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@groow.com","password":"Admin@123456"}'
```
**Expected:** HTTP 200, returns token

### Test 401b: GET /auth/profile
```bash
curl -H "Authorization: Bearer {TOKEN}" \
  https://groow-api.destinpq.com/api/v1/auth/profile
```
**Expected:** HTTP 200, returns user data

### Test 401c: GET /auth/me
```bash
curl -H "Authorization: Bearer {TOKEN}" \
  https://groow-api.destinpq.com/api/v1/auth/me
```
**Expected:** HTTP 200, returns user data

### Test 401d: POST /auth/logout
```bash
curl -X POST -H "Authorization: Bearer {TOKEN}" \
  https://groow-api.destinpq.com/api/v1/auth/logout
```
**Expected:** HTTP 200, logout successful

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-402: Product APIs

**Priority:** Critical  
**Module:** Product API  
**Test Type:** API CRUD

### Test 402a: GET /products
```bash
curl https://groow-api.destinpq.com/api/v1/products
```
**Expected:** HTTP 200, array of products

### Test 402b: POST /products
```bash
curl -X POST https://groow-api.destinpq.com/api/v1/products \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "stock": 100,
    "categoryId": "{CATEGORY_ID}",
    "brandId": "{BRAND_ID}"
  }'
```
**Expected:** HTTP 200, product created

### Test 402c: PATCH /products/:id
```bash
curl -X PATCH https://groow-api.destinpq.com/api/v1/products/{ID} \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Product"}'
```
**Expected:** HTTP 200, product updated

### Test 402d: DELETE /products/:id
```bash
curl -X DELETE https://groow-api.destinpq.com/api/v1/products/{ID} \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```
**Expected:** HTTP 200, product deleted

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

## TC-403: Cart APIs

**Priority:** Critical  
**Module:** Cart API  
**Test Type:** API

### Test 403a: GET /cart
```bash
curl -H "Authorization: Bearer {CUSTOMER_TOKEN}" \
  https://groow-api.destinpq.com/api/v1/cart
```
**Expected:** HTTP 200, cart data

### Test 403b: GET /cart/items
```bash
curl -H "Authorization: Bearer {CUSTOMER_TOKEN}" \
  https://groow-api.destinpq.com/api/v1/cart/items
```
**Expected:** HTTP 200, array of items

### Test 403c: GET /cart/count
```bash
curl -H "Authorization: Bearer {CUSTOMER_TOKEN}" \
  https://groow-api.destinpq.com/api/v1/cart/count
```
**Expected:** HTTP 200, item count

### Actual Result:
- [ ] Pass
- [ ] Fail (describe issue)

---

# TEST EXECUTION GUIDE

## Running Automated Tests

### Cypress Tests (Recommended)
```bash
cd /home/azureuser/Groow/groow/cypress-tests

# Run all tests with video recording
npm test

# Run specific module
npm run test:products
npm run test:auth
npm run test:cart

# Interactive mode (watch tests run)
npm run cypress:open

# Videos saved to: cypress/videos/
# Screenshots saved to: cypress/screenshots/
```

### Bash Script Tests
```bash
cd /home/azureuser/Groow/groow
bash test-all-apis.sh
```

## Manual Testing Checklist

### Before Testing:
- [ ] Verify both domains accessible
- [ ] Clear browser cache
- [ ] Open browser DevTools console
- [ ] Prepare test credentials

### During Testing:
- [ ] Follow test steps exactly
- [ ] Document any errors
- [ ] Take screenshots of failures
- [ ] Note response times
- [ ] Check for console errors

### After Testing:
- [ ] Fill in test results
- [ ] Report bugs using template below
- [ ] Attach screenshots/videos
- [ ] Submit test report

---

# BUG REPORTING TEMPLATE

## Bug Report

**Bug ID:** BUG-[DATE]-[NUMBER]  
**Date:** [Date Found]  
**Tester:** [Your Name]  
**Severity:** Critical / High / Medium / Low  
**Priority:** P1 / P2 / P3

### Environment:
- **URL:** https://groow.destinpq.com/[page]
- **Browser:** Chrome 120
- **OS:** Windows 11 / macOS / Linux
- **Screen Size:** 1920x1080

### Test Case:
**TC ID:** TC-[NUMBER]  
**Test Name:** [Test Case Name]

### Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3

### Expected Result:
[What should happen]

### Actual Result:
[What actually happened]

### Screenshots/Videos:
- Attached: [filename]
- Video: cypress/videos/[test-name].mp4

### Console Errors:
```
[Paste any console errors]
```

### API Errors:
```
[Paste any API error responses]
```

### Additional Notes:
[Any other relevant information]

---

# TEST RESULTS SUMMARY

## Test Execution Summary

**Date:** __________  
**Tester:** __________  
**Build:** Production  

| Module | Total TCs | Passed | Failed | Blocked | Pass Rate |
|--------|-----------|--------|--------|---------|-----------|
| Authentication | 8 | _ | _ | _ | _% |
| Products | 12 | _ | _ | _ | _% |
| Categories | 8 | _ | _ | _ | _% |
| Brands | 8 | _ | _ | _ | _% |
| Cart | 6 | _ | _ | _ | _% |
| Checkout | 10 | _ | _ | _ | _% |
| Orders | 10 | _ | _ | _ | _% |
| Admin Dashboard | 8 | _ | _ | _ | _% |
| Vendor Portal | 12 | _ | _ | _ | _% |
| Customer Portal | 15 | _ | _ | _ | _% |
| Marketing | 12 | _ | _ | _ | _% |
| CMS | 9 | _ | _ | _ | _% |
| Reports | 8 | _ | _ | _ | _% |
| **TOTAL** | **126** | **_** | **_** | **_** | **_%** |

### Overall Status:
- [ ] ✅ Ready for Production
- [ ] ⚠️ Minor Issues Found
- [ ] ❌ Major Issues Found

### Notes:
_______________________________________________
_______________________________________________
_______________________________________________

---

# AUTOMATED TEST RESULTS

## Cypress Test Execution

**Last Run:** November 13, 2025  
**Results:** 123/136 passing (90%)

### Module Results:
- ✅ Products: 9/9 (100%)
- ✅ Categories: 7/7 (100%)
- ✅ Brands: 6/6 (100%)
- ✅ Cart: 5/5 (100%)
- ✅ Reports: 7/7 (100%)
- ✅ RFQ: 5/5 (100%)
- And 15 more modules...

### Video Recordings:
All test executions recorded in:
`cypress-tests/cypress/videos/`

To view:
```bash
cd /home/azureuser/Groow/groow/cypress-tests/cypress/videos
ls -lh *.mp4
```

---

# QUICK REFERENCE

## Important URLs
- Frontend: https://groow.destinpq.com
- Backend: https://groow-api.destinpq.com
- API Docs: https://groow-api.destinpq.com/api/docs

## Test Accounts
- Admin: admin@groow.com / Admin@123456
- Vendor: vendor1@groow.com / Vendor@123456
- Customer: customer1@groow.com / Customer@123456

## Status Check
```bash
# Check all services
pm2 status

# Check health
curl https://groow-api.destinpq.com/api/v1/health
```

---

**Ready to Test!** 🚀  
**For questions, check README.md in project root**

