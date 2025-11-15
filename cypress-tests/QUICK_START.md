# Quick Start - Comprehensive API Testing

**Test all 186+ Groow APIs and get detailed HTTP status code reports in 3 steps**

---

## 🚀 3-Step Quick Start

### Step 1: Install
```bash
cd /home/azureuser/Groow/groow/cypress-tests
npm install
```

### Step 2: Run Tests
```bash
npm run test:comprehensive
```

### Step 3: View Report
```bash
npm run report:open
```

**That's it!** 🎉

---

## 📊 What You Get

After running the tests, you'll have:

### 1. HTML Report
**Location:** `cypress/reports/api-test-report.html`

Beautiful interactive report showing:
- Total tests: 186+
- Pass/fail breakdown
- HTTP status codes for every API
- Response times
- Filter by category or status

### 2. JSON Report
**Location:** `cypress/reports/comprehensive-api-test-report.json`

Programmatic access to:
- All test results
- Category summaries
- Detailed metrics
- Timestamps

### 3. CSV Report
**Location:** `cypress/reports/api-test-report.csv`

Spreadsheet-ready data:
- Import to Excel/Google Sheets
- Analyze trends
- Create custom reports

---

## 🎯 Common Commands

```bash
# Run all API tests (headless)
npm run test:comprehensive

# Run with browser visible
npm run test:comprehensive:headed

# Open Cypress Test Runner (interactive)
npm run cypress:open

# Open HTML report
npm run report:open

# Run specific module tests
npm run test:auth          # Authentication
npm run test:products      # Products
npm run test:orders        # Orders
npm run test:marketing     # Marketing
```

---

## 📋 Understanding Results

### ✅ PASS Examples

```
✓ GET /analytics/dashboard - 200
  → API working, data available

✓ GET /orders - 401
  → Correctly requires authentication

✓ POST /auth/register - 400
  → Correctly validates missing data
```

### ❌ FAIL Examples

```
✗ GET /analytics/dashboard - 404
  → Missing data, run: npm run seed:analytics

✗ GET /vendors/reviews/stats - 404
  → Missing vendor data, run: npm run seed
```

---

## 🔧 Quick Fixes

### If Analytics Tests Fail (404)
```bash
cd ../backend
npm run seed:analytics
cd ../cypress-tests
npm run test:comprehensive
```

### If Auth Tests Fail
```bash
cd ../backend
npm run seed:direct
cd ../cypress-tests
npm run test:comprehensive
```

### If All Tests Fail
```bash
# Check if backend is running
curl https://groow-api.destinpq.com/api/v1/health

# Restart backend if needed
cd ../backend
pm2 restart groow-backend
```

---

## 📊 Sample Output

```
🚀 Starting Comprehensive API Tests

  🔐 Authentication APIs
    ✓ should test login endpoint (234ms)
    ✓ should test register endpoint (189ms)
    ✓ should login as admin (456ms)

  📊 Analytics APIs (Critical)
    ✓ should test analytics dashboard (312ms)
    ✓ should test real-time metrics (156ms)
    ✓ should test sales metrics (198ms)

  🏪 Vendor APIs
    ✓ should test list all vendors (145ms)
    ✓ should test vendor reviews stats (178ms)

  📦 Product APIs
    ✓ should test list products (234ms)
    ✓ should test paginated products (198ms)

  ...

  186 passing (45.2s)

📝 Generating test reports...
✅ Tests Passed: 124
❌ Tests Failed: 62
📊 Total Tests: 186
📁 Report: cypress/reports/api-test-report.html
```

---

## 🎨 Report Preview

### Summary Dashboard
```
┌─────────────────────────────────────────────┐
│ 🚀 Groow API Test Report                   │
├─────────────────────────────────────────────┤
│  186      124       62        45.2s        │
│  Total    Passed   Failed    Duration      │
└─────────────────────────────────────────────┘
```

### Category Breakdown
```
Analytics:       ✓ 45  ✗ 13  (58 total)
Authentication:  ✓ 28  ✗ 2   (30 total)
Products:        ✓ 20  ✗ 6   (26 total)
Vendors:         ✓ 18  ✗ 8   (26 total)
Orders:          ✓ 55  ✗ 0   (55 total)
```

### Detailed Results Table
```
Status │ Method │ Endpoint              │ HTTP │ Time
───────┼────────┼───────────────────────┼──────┼──────
✓ PASS │ GET    │ /analytics/dashboard  │ 200  │ 156ms
✗ FAIL │ GET    │ /analytics/realtime   │ 404  │ 89ms
✓ PASS │ GET    │ /products             │ 200  │ 234ms
✓ PASS │ GET    │ /orders               │ 401  │ 67ms
```

---

## 🎯 What Gets Tested

### Critical APIs (Must Pass)
- ✅ Analytics Dashboard
- ✅ Real-time Metrics
- ✅ Vendor Statistics
- ✅ Product Listings
- ✅ Authentication

### High Priority APIs
- Orders Management
- Customer Profiles
- Vendor Profiles
- Reports
- Marketing

### All Other APIs
- Support Tickets
- Finance
- CMS
- RFQ
- Subscriptions
- Gift Cards
- And 100+ more...

---

## 💡 Pro Tips

### 1. Run Before Deployment
```bash
npm run test:comprehensive
# Only deploy if all critical tests pass
```

### 2. Schedule Daily Tests
```bash
# Add to crontab
0 2 * * * cd /path/to/cypress-tests && npm run test:comprehensive
```

### 3. Compare Reports
```bash
# Save reports with timestamps
npm run test:comprehensive
cp cypress/reports/api-test-report.json reports-$(date +%Y%m%d).json
```

### 4. CI/CD Integration
```yaml
# .github/workflows/api-tests.yml
- name: Run API Tests
  run: |
    cd cypress-tests
    npm install
    npm run test:comprehensive
```

---

## 🆘 Need Help?

### Check Documentation
- [Comprehensive Guide](./COMPREHENSIVE_API_TESTING.md)
- [API Inventory](../API_INVENTORY.md)
- [Solution Summary](../SOLUTION_SUMMARY.md)

### Common Issues

**Issue:** Tests timeout  
**Fix:** Increase timeout in `cypress.config.ts`

**Issue:** 404 errors  
**Fix:** Run database seeding scripts

**Issue:** 401 errors  
**Fix:** Check credentials in `cypress.config.ts`

**Issue:** Reports not generated  
**Fix:** Check `cypress/reports/` directory exists

---

## 🎉 Success Checklist

After running tests, you should have:

- [ ] HTML report generated
- [ ] JSON report generated
- [ ] CSV report generated
- [ ] Know exact HTTP status for each API
- [ ] Identified which APIs need data seeding
- [ ] Verified critical APIs are working
- [ ] Ready to fix any failing tests

---

## 📞 Support

- **Documentation:** See `COMPREHENSIVE_API_TESTING.md`
- **Issues:** Create GitHub issue
- **Questions:** Ask in team Slack

---

**Ready to test?**

```bash
cd /home/azureuser/Groow/groow/cypress-tests
npm install
npm run test:comprehensive
npm run report:open
```

**Happy Testing! 🚀**

