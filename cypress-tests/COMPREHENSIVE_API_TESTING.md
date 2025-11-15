# Comprehensive API Testing Suite

**Complete E2E testing for all 186+ Groow Platform APIs with detailed HTTP status code reporting**

---

## 🎯 Overview

This Cypress test suite provides comprehensive end-to-end testing for all API endpoints in the Groow platform, including:

- **186+ API endpoints** across 13 major modules
- **Detailed HTTP status code reporting** for every request
- **Beautiful HTML reports** with filtering and categorization
- **CSV exports** for data analysis
- **JSON reports** for programmatic access
- **Real-time test execution** with Cypress UI

---

## 📊 Test Coverage

### Modules Tested

| Module | Endpoints | Status Codes Tested | Priority |
|--------|-----------|---------------------|----------|
| Authentication | 30 | 200, 400, 401 | Critical |
| Analytics | 58 | 200, 404 | Critical |
| Vendors | 47 | 200, 401, 404 | High |
| Products | 26 | 200, 404 | High |
| Orders | 55 | 401 | High |
| Reports | 51 | 200, 401 | Medium |
| Marketing | 71 | 200, 401, 404 | Medium |
| Customers | 57 | 401 | Medium |
| RFQ | 39 | 401 | Medium |
| Support | 22 | 200, 401 | Medium |
| Finance | 27 | 401 | Medium |
| CMS | 35 | 200, 404 | Medium |
| Others | 50+ | Various | Low |

**Total:** 568+ individual API tests

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /home/azureuser/Groow/groow/cypress-tests
npm install
```

### 2. Run Comprehensive Test Suite

```bash
# Headless mode (CI/CD)
npm run test:comprehensive

# Headed mode (see tests run in browser)
npm run test:comprehensive:headed

# Interactive mode (Cypress UI)
npm run cypress:open
```

### 3. View Reports

```bash
# Open HTML report in browser
npm run report:open

# Or manually open:
# cypress/reports/api-test-report.html
```

---

## 📋 Test Commands

### Comprehensive Testing

```bash
# Run all API tests (186+ endpoints)
npm run test:comprehensive

# Run with browser visible
npm run test:comprehensive:headed

# Open Cypress Test Runner
npm run cypress:open
```

### Module-Specific Testing

```bash
# Authentication tests
npm run test:auth

# Product tests
npm run test:products

# Order tests
npm run test:orders

# Marketing tests
npm run test:marketing

# CMS tests
npm run test:cms

# Reports tests
npm run test:reports

# RFQ tests
npm run test:rfq

# Core modules (auth, products, categories, brands, orders, cart)
npm run test:core

# All tests
npm run test:all
```

---

## 📊 Report Formats

### 1. HTML Report (Recommended)

**Location:** `cypress/reports/api-test-report.html`

**Features:**
- ✅ Beautiful, interactive UI
- ✅ Filter by status (passed/failed)
- ✅ Filter by category
- ✅ Color-coded status codes
- ✅ Response time tracking
- ✅ Category summaries
- ✅ Overall statistics

**Example:**
```
🚀 Groow API Test Report
========================
Generated: Nov 15, 2025, 8:30 AM
Duration: 45.2s

Summary:
- Total Tests: 186
- Passed: 124 (67%)
- Failed: 62 (33%)

Category Breakdown:
- Analytics: 58 tests (✓ 45, ✗ 13)
- Authentication: 30 tests (✓ 28, ✗ 2)
- Products: 26 tests (✓ 20, ✗ 6)
...
```

### 2. JSON Report

**Location:** `cypress/reports/comprehensive-api-test-report.json`

**Structure:**
```json
{
  "totalTests": 186,
  "passed": 124,
  "failed": 62,
  "skipped": 0,
  "duration": 45234,
  "timestamp": "2025-11-15T08:30:00.000Z",
  "results": [
    {
      "endpoint": "/analytics/dashboard",
      "method": "GET",
      "statusCode": 200,
      "expectedStatus": 200,
      "responseTime": 156,
      "success": true,
      "category": "Analytics",
      "requiresAuth": false,
      "timestamp": "2025-11-15T08:30:01.234Z"
    },
    ...
  ],
  "categorySummary": {
    "Analytics": {
      "total": 58,
      "passed": 45,
      "failed": 13
    },
    ...
  }
}
```

### 3. CSV Report

**Location:** `cypress/reports/api-test-report.csv`

**Format:**
```csv
Status,Method,Endpoint,HTTP Code,Expected,Response Time (ms),Category,Requires Auth,Error
PASS,GET,"/analytics/dashboard",200,200,156,Analytics,false,
FAIL,GET,"/analytics/realtime",404,200,89,Analytics,false,Expected 200, got 404
...
```

**Use Cases:**
- Import into Excel/Google Sheets
- Data analysis with Python/R
- Generate custom charts
- Track trends over time

---

## 🔍 Understanding Test Results

### HTTP Status Codes

| Code | Meaning | Test Result |
|------|---------|-------------|
| 200 | OK | ✅ Success (data returned) |
| 201 | Created | ✅ Success (resource created) |
| 400 | Bad Request | ⚠️ Expected (validation error) |
| 401 | Unauthorized | ⚠️ Expected (requires auth) |
| 404 | Not Found | ❌ Failed (missing data/endpoint) |
| 500 | Server Error | ❌ Failed (backend error) |

### Test Status Interpretation

#### ✅ PASS - Expected Behavior
```
GET /analytics/dashboard - 200 ✅
  Expected: 200, Got: 200
  → Data is available, endpoint working
```

```
GET /orders - 401 ✅
  Expected: 401, Got: 401
  → Correctly requires authentication
```

```
POST /auth/register - 400 ✅
  Expected: 400, Got: 400
  → Correctly validates missing data
```

#### ❌ FAIL - Needs Attention
```
GET /analytics/dashboard - 404 ❌
  Expected: 200, Got: 404
  → Missing data in database, run seeding
```

```
GET /vendors/reviews/stats - 404 ❌
  Expected: 200, Got: 404
  → Missing vendor performance data
```

---

## 🎯 Test Scenarios

### 1. Public Endpoints (No Auth Required)

**Expected: 200 OK**
- `/products` - List all products
- `/categories` - List all categories
- `/analytics/dashboard` - Get dashboard data
- `/vendors` - List all vendors
- `/cms/pages` - Get CMS pages
- `/deals` - Get active deals

**Expected: 400 Bad Request**
- `/auth/register` (without data)
- `/products/search` (without query)
- `/coupons/validate` (without code)

### 2. Protected Endpoints (Auth Required)

**Expected: 401 Unauthorized (without token)**
- `/orders` - User orders
- `/customers/profile` - Customer profile
- `/vendors/profile` - Vendor profile
- `/finance/transactions` - Financial data
- `/reports/dashboard` - Admin reports

**Expected: 200 OK (with valid token)**
- All protected endpoints when authenticated

### 3. Resource Endpoints

**Expected: 404 Not Found**
- `/products/non-existent-id`
- `/orders/invalid-id`
- `/vendors/fake-id`

---

## 🛠️ Configuration

### Environment Variables

Edit `cypress.config.ts`:

```typescript
env: {
  API_BASE_URL: 'https://groow-api.destinpq.com/api/v1',
  ADMIN_EMAIL: 'admin@groow.com',
  ADMIN_PASSWORD: 'Admin@123456',
  VENDOR_EMAIL: 'vendor1@groow.com',
  VENDOR_PASSWORD: 'Vendor@123456',
  CUSTOMER_EMAIL: 'customer1@groow.com',
  CUSTOMER_PASSWORD: 'Customer@123456'
}
```

### Test Timeouts

```typescript
// In cypress.config.ts
{
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 30000
}
```

---

## 📈 CI/CD Integration

### GitHub Actions

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd cypress-tests
          npm install
      
      - name: Run comprehensive API tests
        run: |
          cd cypress-tests
          npm run test:comprehensive
      
      - name: Upload test reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-reports
          path: cypress-tests/cypress/reports/
```

### GitLab CI

```yaml
api-tests:
  stage: test
  image: cypress/base:18
  script:
    - cd cypress-tests
    - npm install
    - npm run test:comprehensive
  artifacts:
    when: always
    paths:
      - cypress-tests/cypress/reports/
    expire_in: 30 days
```

---

## 🔧 Troubleshooting

### Issue: Tests Failing with 404

**Cause:** Database not seeded with data

**Solution:**
```bash
cd /home/azureuser/Groow/groow/backend
npm run seed:analytics
npm run seed
```

### Issue: Authentication Tests Failing

**Cause:** Invalid credentials or user doesn't exist

**Solution:**
```bash
# Create admin user
cd /home/azureuser/Groow/groow/backend
npm run seed:direct
```

### Issue: Slow Test Execution

**Cause:** Network latency or slow backend

**Solution:**
- Increase timeouts in `cypress.config.ts`
- Run tests against local backend
- Use `--parallel` flag for faster execution

### Issue: Reports Not Generated

**Cause:** Reports directory doesn't exist

**Solution:**
```bash
mkdir -p cypress/reports
npm run test:comprehensive
```

---

## 📊 Sample Test Output

### Console Output

```
🚀 Starting Comprehensive API Tests

  🔐 Authentication APIs
    ✓ should test login endpoint (234ms)
    ✓ should test register endpoint (189ms)
    ✓ should login as admin and get token (456ms)
    ✓ should test refresh token endpoint (123ms)
    ✓ should test logout endpoint (98ms)

  📊 Analytics APIs (Critical)
    ✓ should test analytics dashboard (312ms)
    ✓ should test analytics dashboard with filters (289ms)
    ✓ should test real-time metrics (156ms)
    ✓ should test executive dashboard (234ms)
    ✓ should test sales metrics (198ms)
    ✓ should test performance alerts (167ms)

  🏪 Vendor APIs
    ✓ should test list all vendors (145ms)
    ✓ should test vendor reviews stats (178ms)
    ✓ should test vendor profile (requires auth) (89ms)

  📦 Product APIs
    ✓ should test list products (234ms)
    ✓ should test paginated products (198ms)
    ✓ should test product search (167ms)

  ...

  186 passing (45.2s)

📝 Generating test reports...
✅ Tests Passed: 124
❌ Tests Failed: 62
📊 Total Tests: 186
📁 Report saved to: cypress/reports/api-test-report.html
```

---

## 🎨 Report Screenshots

### HTML Report - Summary View
```
┌─────────────────────────────────────────────┐
│ 🚀 Groow API Test Report                   │
│ Generated: Nov 15, 2025, 8:30 AM           │
│ Duration: 45.2s                             │
├─────────────────────────────────────────────┤
│  186      124       62        45.2s        │
│  Total    Passed   Failed    Duration      │
└─────────────────────────────────────────────┘
```

### HTML Report - Category View
```
┌─────────────────────────────────────────────┐
│ 📊 Results by Category                     │
├─────────────────────────────────────────────┤
│ Analytics        ✓ 45  ✗ 13  Total: 58    │
│ Authentication   ✓ 28  ✗ 2   Total: 30    │
│ Products         ✓ 20  ✗ 6   Total: 26    │
│ Vendors          ✓ 18  ✗ 8   Total: 26    │
│ Orders           ✓ 0   ✗ 0   Total: 55    │
│ ...                                         │
└─────────────────────────────────────────────┘
```

### HTML Report - Detailed Results
```
┌────────────────────────────────────────────────────────────────┐
│ Status │ Method │ Endpoint              │ Code │ Time │ Auth │
├────────────────────────────────────────────────────────────────┤
│ ✓ PASS │ GET    │ /analytics/dashboard  │ 200  │ 156  │ 🌐   │
│ ✗ FAIL │ GET    │ /analytics/realtime   │ 404  │ 89   │ 🌐   │
│ ✓ PASS │ GET    │ /products             │ 200  │ 234  │ 🌐   │
│ ✓ PASS │ GET    │ /orders               │ 401  │ 67   │ 🔒   │
│ ...                                                             │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Best Practices

### 1. Run Tests Regularly

```bash
# Daily automated run
0 2 * * * cd /home/azureuser/Groow/groow/cypress-tests && npm run test:comprehensive
```

### 2. Review Failed Tests

- Check if 404 errors indicate missing data (run seeding)
- Verify 401 errors are expected for protected endpoints
- Investigate 500 errors immediately (backend issues)

### 3. Track Trends

- Export CSV reports daily
- Compare pass/fail rates over time
- Monitor response time changes

### 4. Update Tests

- Add new endpoints as they're developed
- Update expected status codes
- Adjust timeouts based on performance

---

## 📚 Additional Resources

### Documentation
- [Cypress Documentation](https://docs.cypress.io)
- [API Inventory](../API_INVENTORY.md)
- [API Response Analysis](../API_RESPONSE_ANALYSIS.md)
- [Solution Summary](../SOLUTION_SUMMARY.md)

### Support
- Report issues: Create GitHub issue
- Ask questions: Team Slack channel
- Contribute: Submit pull request

---

## 🎉 Summary

This comprehensive test suite provides:

✅ **Complete Coverage** - All 186+ API endpoints tested  
✅ **Detailed Reporting** - HTML, JSON, and CSV formats  
✅ **HTTP Status Tracking** - Exact status codes for every request  
✅ **Category Organization** - Tests grouped by module  
✅ **CI/CD Ready** - Easy integration with pipelines  
✅ **Developer Friendly** - Clear output and documentation  

**Run your first test:**
```bash
cd cypress-tests
npm install
npm run test:comprehensive
npm run report:open
```

---

**Last Updated:** November 15, 2025  
**Maintained By:** Groow Development Team  
**Version:** 1.0.0

