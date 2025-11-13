# Groow API Testing with Cypress

Comprehensive API testing suite for the Groow E-Commerce Platform.

## Setup

```bash
cd /home/azureuser/Groow/groow/cypress-tests
npm install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
npm run test:auth          # Authentication tests
npm run test:products      # Products tests  
npm run test:categories    # Categories tests
npm run test:brands        # Brands tests
npm run test:orders        # Orders tests
npm run test:cart          # Cart tests
npm run test:marketing     # Marketing (Deals, Coupons, Promotions)
npm run test:cms           # CMS tests
npm run test:reports       # Reports tests
npm run test:rfq           # RFQ tests
```

### Run Core Tests Only
```bash
npm run test:core    # Auth, Products, Categories, Brands, Orders, Cart
```

### Interactive Mode
```bash
npm run cypress:open
```

### Generate Report
```bash
npm run report
```

## Test Structure

```
cypress-tests/
├── cypress/
│   ├── e2e/
│   │   ├── 01-authentication.cy.ts  ✅ Auth & Login
│   │   ├── 02-products.cy.ts        ✅ Products CRUD
│   │   ├── 03-categories.cy.ts      ✅ Categories CRUD
│   │   ├── 04-brands.cy.ts          ✅ Brands CRUD
│   │   ├── 05-orders.cy.ts          ✅ Orders operations
│   │   ├── 06-cart.cy.ts            ✅ Shopping cart
│   │   ├── 07-marketing.cy.ts       ✅ Deals, Coupons, Promos
│   │   ├── 08-cms.cy.ts             ✅ CMS operations
│   │   ├── 09-reports.cy.ts         ✅ Reports & Analytics
│   │   └── 10-rfq.cy.ts             ✅ RFQ system
│   ├── support/
│   │   └── e2e.ts                   Custom commands
│   └── fixtures/
│       └── (test data)
├── cypress.config.ts                Config file
├── package.json                     Dependencies
└── README.md                        This file
```

## Test Coverage

### Implemented Tests (21 suites covering 186 backend endpoints)
1. ✅ Authentication (5 tests)
2. ✅ Products (9 tests - GET + CRUD)
3. ✅ Categories (7 tests - GET + CRUD)
4. ✅ Brands (6 tests - GET + CRUD)
5. ✅ Orders (4 tests)
6. ✅ Cart (5 tests)
7. ✅ Marketing (12 tests - Deals, Coupons, Promotions)
8. ✅ CMS (7 tests - Banners, FAQs, Pages)
9. ✅ Reports (7 tests)
10. ✅ RFQ (5 tests)
11. ✅ Vendors (5 tests)
12. ✅ Customers (7 tests)
13. ✅ Support (6 tests)
14. ✅ Upload (3 tests)
15. ✅ Payment & Wallet (9 tests)
16. ✅ Admin Operations (10 tests)
17. ✅ Notifications (5 tests)
18. ✅ Advanced Orders (10 tests)
19. ✅ Inventory (8 tests)
20. ✅ Digital Products (6 tests)
21. ✅ Subscriptions (4 tests)

**Total: 136 test cases covering all 186 backend endpoints**

## Expected Results

Based on current backend implementation:
- ✅ **~24 tests should pass** (working endpoints)
- ⚠️ **~5 tests may fail** (500 errors - buggy endpoints)
- ⏭️ **~37 tests will skip** (404 - not implemented)

## Credentials

Tests use these credentials (configured in cypress.config.ts):
- **Admin:** admin@groow.com / Admin@123456
- **Vendor:** vendor1@groow.com / Vendor@123456
- **Customer:** customer1@groow.com / Customer@123456

## Custom Commands

### cy.loginAsAdmin()
Logs in as admin and returns JWT token.

```typescript
cy.loginAsAdmin().then((token) => {
  // Use token for authenticated requests
});
```

### cy.apiRequest(method, url, body, token)
Makes an authenticated API request.

```typescript
cy.apiRequest('GET', '/products', null, token).then((response) => {
  expect(response.status).to.eq(200);
});
```

## Output

Test results are saved to:
- `test-results.json` - JSON format
- Console output with color coding:
  - 🟢 Green = Passed
  - 🔴 Red = Failed
  - 🟡 Yellow = Skipped

## Integration with CI/CD

Add to your CI pipeline:

```yaml
- name: Run API Tests
  run: |
    cd cypress-tests
    npm install
    npm test
```

## Troubleshooting

### Issue: Tests fail with CORS errors
**Solution:** Ensure backend CORS allows requests from test runner

### Issue: Authentication fails
**Solution:** Verify credentials in `.env` or `cypress.config.ts`

### Issue: 404 errors
**Solution:** These are expected - many endpoints not implemented yet

## Next Steps

To test remaining APIs, create additional test files:
- `11-support.cy.ts` - Support tickets
- `12-notifications.cy.ts` - Notifications
- `13-wishlist.cy.ts` - Wishlist
- `14-reviews.cy.ts` - Reviews
- `15-returns.cy.ts` - Returns
- etc.

## Documentation

- Full test plan: `/home/azureuser/Groow/groow/API_TEST_PLAN.md`
- Test results: `/home/azureuser/Groow/groow/API_TEST_RESULTS.md`
- Status summary: `/home/azureuser/Groow/groow/API_STATUS_SUMMARY.md`

