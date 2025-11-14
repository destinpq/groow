## Groow Testing Overview

### Automated Testing (Cypress)

- **Location:** `cypress-tests/`
- **Tech:** Cypress with TypeScript.
- **Coverage:**
  - 20+ suites (auth, products, categories, brands, cart, orders, marketing, CMS, reports, RFQ, vendors, customers, support, uploads, payments, advanced orders, inventory, digital products, subscriptions, etc.).
  - ~130–140 individual tests exercising ~180+ backend endpoints.

#### Running All Tests (Headless)

```bash
cd /home/azureuser/Groow/groow/cypress-tests
npm install          # first time only
npm test             # run all suites headless with video
```

- Videos: `cypress-tests/cypress/videos/`
- Screenshots on failure: `cypress-tests/cypress/screenshots/`

#### Running Specific Suites

```bash
cd /home/azureuser/Groow/groow/cypress-tests

npm run test:auth          # authentication
npm run test:products      # products module
npm run test:cart          # cart module
npm run test:marketing     # deals/coupons/promotions
# …see package.json in cypress-tests for full list
```

#### Interactive Mode

```bash
cd /home/azureuser/Groow/groow/cypress-tests
npm run cypress:open
```

Select a spec file in the Cypress UI to watch tests run in a real browser with time‑travel debugging.

### API Smoke Tests (Shell)

- **Script:** `test-all-apis.sh`
- **Base URL:** `https://groow-api.destinpq.com/api/v1`
- **Purpose:** Quick high‑level health check of many REST endpoints (groups by modules like products, categories, brands, cart, orders, deals, coupons, promotions, CMS, shipping, tax, RFQ, subscriptions, returns, reviews, wishlist, etc.).

Usage:

```bash
cd /home/azureuser/Groow/groow
bash test-all-apis.sh
```

Outputs:
- Colorised console summary of passed/failed/skipped tests.
- JSON results file: `api_test_results_YYYYMMDD_HHMMSS.json`.
- Log file: `api_test_log_YYYYMMDD_HHMMSS.txt`.

### Manual Testing

For deeper exploratory and UX testing, use this flow:

- **Environment**
  - Frontend: `https://groow.destinpq.com`
  - Backend: `https://groow-api.destinpq.com/api/v1`

- **Test Accounts**
  - Admin: `admin@groow.com` / `Admin@123456`
  - Vendor: `vendor1@groow.com` / `Vendor@123456`
  - Customer: `customer1@groow.com` / `Customer@123456`

- **Key Flows to Verify**
  - Authentication: login, logout, profile, password reset.
  - Catalog: browse/search/filter services/products.
  - Cart & checkout: add/update/remove items, place order.
  - Orders: order history and details for customers; management for admin/vendor.
  - Admin: dashboards, catalog management, CMS, marketing, reports, settings.
  - Vendor: dashboards, service portfolio, orders, analytics.

When logging issues, capture:

- Exact URL and role used.
- Steps to reproduce.
- Expected vs actual behaviour.
- Console errors and relevant API responses.
- Screenshots or test videos (from Cypress if applicable).


