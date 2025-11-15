/**
 * API Test Helpers
 * Utilities for comprehensive API testing with detailed reporting
 */

export interface APITestResult {
  endpoint: string;
  method: string;
  statusCode: number;
  expectedStatus: number;
  responseTime: number;
  success: boolean;
  error?: string;
  responseBody?: any;
  headers?: any;
  timestamp: string;
  category: string;
  requiresAuth: boolean;
}

export interface APITestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  timestamp: string;
  results: APITestResult[];
  categorySummary: Record<string, {
    total: number;
    passed: number;
    failed: number;
  }>;
}

let testResults: APITestResult[] = [];
let testStartTime: number;

export const initializeTestSession = () => {
  testResults = [];
  testStartTime = Date.now();
};

export const recordTestResult = (result: APITestResult) => {
  testResults.push(result);
};

export const getTestResults = (): APITestResult[] => {
  return testResults;
};

export const generateTestSummary = (): APITestSummary => {
  const categorySummary: Record<string, any> = {};
  
  testResults.forEach(result => {
    if (!categorySummary[result.category]) {
      categorySummary[result.category] = { total: 0, passed: 0, failed: 0 };
    }
    categorySummary[result.category].total++;
    if (result.success) {
      categorySummary[result.category].passed++;
    } else {
      categorySummary[result.category].failed++;
    }
  });

  return {
    totalTests: testResults.length,
    passed: testResults.filter(r => r.success).length,
    failed: testResults.filter(r => !r.success).length,
    skipped: 0,
    duration: Date.now() - testStartTime,
    timestamp: new Date().toISOString(),
    results: testResults,
    categorySummary
  };
};

export const saveTestReport = (filename: string = 'api-test-report.json') => {
  const summary = generateTestSummary();
  cy.writeFile(`cypress/reports/${filename}`, summary);
  
  // Also generate HTML report
  generateHTMLReport(summary);
  
  // Generate CSV report
  generateCSVReport(summary);
};

const generateHTMLReport = (summary: APITestSummary) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Groow API Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header .meta { opacity: 0.9; font-size: 14px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; border-bottom: 1px solid #e0e0e0; }
    .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
    .summary-card.total { background: #e3f2fd; color: #1976d2; }
    .summary-card.passed { background: #e8f5e9; color: #388e3c; }
    .summary-card.failed { background: #ffebee; color: #d32f2f; }
    .summary-card.duration { background: #fff3e0; color: #f57c00; }
    .summary-card .number { font-size: 48px; font-weight: bold; margin-bottom: 5px; }
    .summary-card .label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .category-summary { padding: 30px; border-bottom: 1px solid #e0e0e0; }
    .category-summary h2 { margin-bottom: 20px; color: #333; }
    .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
    .category-card { padding: 15px; border: 1px solid #e0e0e0; border-radius: 6px; background: #fafafa; }
    .category-card h3 { font-size: 16px; margin-bottom: 10px; color: #555; }
    .category-stats { display: flex; justify-content: space-between; font-size: 14px; }
    .category-stats span { padding: 4px 8px; border-radius: 4px; }
    .stat-passed { background: #c8e6c9; color: #2e7d32; }
    .stat-failed { background: #ffcdd2; color: #c62828; }
    .results { padding: 30px; }
    .results h2 { margin-bottom: 20px; color: #333; }
    .filter-bar { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
    .filter-btn { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
    .filter-btn:hover { background: #f5f5f5; }
    .filter-btn.active { background: #667eea; color: white; border-color: #667eea; }
    .results-table { width: 100%; border-collapse: collapse; }
    .results-table th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; position: sticky; top: 0; }
    .results-table td { padding: 12px; border-bottom: 1px solid #eee; }
    .results-table tr:hover { background: #f9f9f9; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .status-success { background: #c8e6c9; color: #2e7d32; }
    .status-fail { background: #ffcdd2; color: #c62828; }
    .status-code { font-family: 'Courier New', monospace; font-weight: bold; padding: 2px 6px; border-radius: 3px; }
    .status-200 { background: #c8e6c9; color: #2e7d32; }
    .status-201 { background: #c8e6c9; color: #2e7d32; }
    .status-400 { background: #fff9c4; color: #f57f17; }
    .status-401 { background: #ffe0b2; color: #e65100; }
    .status-404 { background: #ffcdd2; color: #c62828; }
    .status-500 { background: #f44336; color: white; }
    .method { font-family: 'Courier New', monospace; font-weight: bold; padding: 2px 6px; border-radius: 3px; font-size: 11px; }
    .method-GET { background: #e3f2fd; color: #1976d2; }
    .method-POST { background: #e8f5e9; color: #388e3c; }
    .method-PUT { background: #fff3e0; color: #f57c00; }
    .method-PATCH { background: #f3e5f5; color: #7b1fa2; }
    .method-DELETE { background: #ffebee; color: #d32f2f; }
    .response-time { color: #666; font-size: 12px; }
    .endpoint { font-family: 'Courier New', monospace; font-size: 13px; color: #333; }
    .error-message { color: #d32f2f; font-size: 12px; font-style: italic; }
    .footer { padding: 20px 30px; background: #f5f5f5; border-radius: 0 0 8px 8px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Groow API Test Report</h1>
      <div class="meta">
        <div>Generated: ${new Date(summary.timestamp).toLocaleString()}</div>
        <div>Duration: ${(summary.duration / 1000).toFixed(2)}s</div>
      </div>
    </div>

    <div class="summary">
      <div class="summary-card total">
        <div class="number">${summary.totalTests}</div>
        <div class="label">Total Tests</div>
      </div>
      <div class="summary-card passed">
        <div class="number">${summary.passed}</div>
        <div class="label">Passed</div>
      </div>
      <div class="summary-card failed">
        <div class="number">${summary.failed}</div>
        <div class="label">Failed</div>
      </div>
      <div class="summary-card duration">
        <div class="number">${(summary.duration / 1000).toFixed(1)}s</div>
        <div class="label">Duration</div>
      </div>
    </div>

    <div class="category-summary">
      <h2>📊 Results by Category</h2>
      <div class="category-grid">
        ${Object.entries(summary.categorySummary).map(([category, stats]) => `
          <div class="category-card">
            <h3>${category}</h3>
            <div class="category-stats">
              <span class="stat-passed">✓ ${stats.passed}</span>
              <span class="stat-failed">✗ ${stats.failed}</span>
              <span>Total: ${stats.total}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="results">
      <h2>📋 Detailed Results</h2>
      <div class="filter-bar">
        <button class="filter-btn active" onclick="filterResults('all')">All</button>
        <button class="filter-btn" onclick="filterResults('passed')">Passed</button>
        <button class="filter-btn" onclick="filterResults('failed')">Failed</button>
        ${Object.keys(summary.categorySummary).map(cat => 
          `<button class="filter-btn" onclick="filterResults('${cat}')">${cat}</button>`
        ).join('')}
      </div>
      <table class="results-table" id="resultsTable">
        <thead>
          <tr>
            <th>Status</th>
            <th>Method</th>
            <th>Endpoint</th>
            <th>HTTP Code</th>
            <th>Expected</th>
            <th>Response Time</th>
            <th>Category</th>
            <th>Auth</th>
          </tr>
        </thead>
        <tbody>
          ${summary.results.map(result => `
            <tr data-status="${result.success ? 'passed' : 'failed'}" data-category="${result.category}">
              <td>
                <span class="status-badge ${result.success ? 'status-success' : 'status-fail'}">
                  ${result.success ? '✓ PASS' : '✗ FAIL'}
                </span>
              </td>
              <td><span class="method method-${result.method}">${result.method}</span></td>
              <td class="endpoint">${result.endpoint}</td>
              <td><span class="status-code status-${result.statusCode}">${result.statusCode}</span></td>
              <td><span class="status-code status-${result.expectedStatus}">${result.expectedStatus}</span></td>
              <td class="response-time">${result.responseTime}ms</td>
              <td>${result.category}</td>
              <td>${result.requiresAuth ? '🔒' : '🌐'}</td>
            </tr>
            ${result.error ? `
              <tr data-status="${result.success ? 'passed' : 'failed'}" data-category="${result.category}">
                <td colspan="8" class="error-message">Error: ${result.error}</td>
              </tr>
            ` : ''}
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>Groow Platform API Testing Suite | Powered by Cypress</p>
    </div>
  </div>

  <script>
    function filterResults(filter) {
      const rows = document.querySelectorAll('#resultsTable tbody tr');
      const buttons = document.querySelectorAll('.filter-btn');
      
      buttons.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      
      rows.forEach(row => {
        if (filter === 'all') {
          row.style.display = '';
        } else if (filter === 'passed' || filter === 'failed') {
          row.style.display = row.dataset.status === filter ? '' : 'none';
        } else {
          row.style.display = row.dataset.category === filter ? '' : 'none';
        }
      });
    }
  </script>
</body>
</html>
  `;

  cy.writeFile('cypress/reports/api-test-report.html', html);
};

const generateCSVReport = (summary: APITestSummary) => {
  const headers = 'Status,Method,Endpoint,HTTP Code,Expected,Response Time (ms),Category,Requires Auth,Error\n';
  const rows = summary.results.map(r => 
    `${r.success ? 'PASS' : 'FAIL'},${r.method},"${r.endpoint}",${r.statusCode},${r.expectedStatus},${r.responseTime},${r.category},${r.requiresAuth},${r.error || ''}`
  ).join('\n');
  
  cy.writeFile('cypress/reports/api-test-report.csv', headers + rows);
};

/**
 * Test an API endpoint and record the result
 */
export const testAPI = (
  method: string,
  endpoint: string,
  expectedStatus: number,
  category: string,
  options: {
    requiresAuth?: boolean;
    authToken?: string;
    body?: any;
    headers?: any;
    description?: string;
  } = {}
) => {
  const startTime = Date.now();
  const requestOptions: any = {
    method,
    url: endpoint,
    failOnStatusCode: false,
    headers: options.headers || {},
  };

  if (options.authToken) {
    requestOptions.headers['Authorization'] = `Bearer ${options.authToken}`;
  }

  if (options.body) {
    requestOptions.body = options.body;
  }

  cy.request(requestOptions).then((response) => {
    const responseTime = Date.now() - startTime;
    const success = response.status === expectedStatus;

    const result: APITestResult = {
      endpoint,
      method,
      statusCode: response.status,
      expectedStatus,
      responseTime,
      success,
      error: success ? undefined : `Expected ${expectedStatus}, got ${response.status}`,
      responseBody: response.body,
      headers: response.headers,
      timestamp: new Date().toISOString(),
      category,
      requiresAuth: options.requiresAuth || false,
    };

    recordTestResult(result);

    // Log to Cypress
    if (success) {
      cy.log(`✅ ${method} ${endpoint} - ${response.status}`);
    } else {
      cy.log(`❌ ${method} ${endpoint} - Expected ${expectedStatus}, got ${response.status}`);
    }
  });
};

/**
 * Batch test multiple endpoints
 */
export const testAPIBatch = (
  tests: Array<{
    method: string;
    endpoint: string;
    expectedStatus: number;
    category: string;
    requiresAuth?: boolean;
    authToken?: string;
    body?: any;
  }>
) => {
  tests.forEach(test => {
    testAPI(test.method, test.endpoint, test.expectedStatus, test.category, {
      requiresAuth: test.requiresAuth,
      authToken: test.authToken,
      body: test.body,
    });
  });
};

