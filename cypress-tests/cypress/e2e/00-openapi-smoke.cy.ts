// OpenAPI-based smoke tests that hit ALL documented GET endpoints
// - Logs in once (admin) and reuses token
// - Fetches swagger (OpenAPI) spec from backend
// - Iterates all GET paths (skips params like {id})
// - Ensures no 5xx response

type OpenApiDoc = {
  paths: Record<
    string,
    Record<
      string,
      {
        summary?: string;
        operationId?: string;
        tags?: string[];
      }
    >
  >;
};

const API_PREFIX = '/api/v1';
const OPENAPI_URL = 'https://groow-api.destinpq.com/api-json';

function toRelativePath(path: string): string {
  // Cypress baseUrl is already set to https://groow-api.destinpq.com/api/v1
  // So pass a path relative to /api/v1
  if (path.startsWith(API_PREFIX)) {
    return path.substring(API_PREFIX.length) || '/';
  }
  return path;
}

describe('OpenAPI smoke - GET endpoints', () => {
  let adminToken: string | null = null;

  before(() => {
    // Login as admin to get token
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
      failOnStatusCode: false,
    }).then((res) => {
      // Accept both wrapped and flat structures
      adminToken =
        res.body?.data?.token ||
        res.body?.token ||
        res.body?.access_token ||
        null;
      cy.log(`Admin token present: ${!!adminToken}`);
    });
  });

  it('loads OpenAPI spec and hits all documented GET endpoints (no 5xx)', () => {
    cy.request(OPENAPI_URL).then((swaggerRes) => {
      const doc = swaggerRes.body as OpenApiDoc;
      expect(doc).to.have.property('paths');

      const entries = Object.entries(doc.paths);
      cy.log(`Discovered ${entries.length} paths from OpenAPI`);

      entries.forEach(([path, methods]) => {
        // Skip parameterized endpoints for the generic smoke pass
        if (path.includes('{')) return;

        const lowerMethods = Object.keys(methods).map((m) => m.toLowerCase());
        if (!lowerMethods.includes('get')) return;

        const rel = toRelativePath(path);
        const headers: Record<string, string> = {};
        if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

        cy.request({
          method: 'GET',
          url: rel,
          headers,
          failOnStatusCode: false, // we want to record failures, not abort
        }).then((res) => {
          // Hard fail on 5xx, allow 2xx/3xx/4xx to proceed
          const status = res.status;
          expect(
            status,
            `GET ${rel} should not return 5xx`
          ).to.be.lessThan(500);
          cy.log(`GET ${rel} -> ${status}`);
        });
      });
    });
  });
});


// - Logs in once (admin) and reuses token
// - Fetches swagger (OpenAPI) spec from backend
// - Iterates all GET paths (skips params like {id})
// - Ensures no 5xx response

type OpenApiDoc = {
  paths: Record<
    string,
    Record<
      string,
      {
        summary?: string;
        operationId?: string;
        tags?: string[];
      }
    >
  >;
};

const API_PREFIX = '/api/v1';
const OPENAPI_URL = 'https://groow-api.destinpq.com/api-json';

function toRelativePath(path: string): string {
  // Cypress baseUrl is already set to https://groow-api.destinpq.com/api/v1
  // So pass a path relative to /api/v1
  if (path.startsWith(API_PREFIX)) {
    return path.substring(API_PREFIX.length) || '/';
  }
  return path;
}

describe('OpenAPI smoke - GET endpoints', () => {
  let adminToken: string | null = null;

  before(() => {
    // Login as admin to get token
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
      failOnStatusCode: false,
    }).then((res) => {
      // Accept both wrapped and flat structures
      adminToken =
        res.body?.data?.token ||
        res.body?.token ||
        res.body?.access_token ||
        null;
      cy.log(`Admin token present: ${!!adminToken}`);
    });
  });

  it('loads OpenAPI spec and hits all documented GET endpoints (no 5xx)', () => {
    cy.request(OPENAPI_URL).then((swaggerRes) => {
      const doc = swaggerRes.body as OpenApiDoc;
      expect(doc).to.have.property('paths');

      const entries = Object.entries(doc.paths);
      cy.log(`Discovered ${entries.length} paths from OpenAPI`);

      entries.forEach(([path, methods]) => {
        // Skip parameterized endpoints for the generic smoke pass
        if (path.includes('{')) return;

        const lowerMethods = Object.keys(methods).map((m) => m.toLowerCase());
        if (!lowerMethods.includes('get')) return;

        const rel = toRelativePath(path);
        const headers: Record<string, string> = {};
        if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

        cy.request({
          method: 'GET',
          url: rel,
          headers,
          failOnStatusCode: false, // we want to record failures, not abort
        }).then((res) => {
          // Hard fail on 5xx, allow 2xx/3xx/4xx to proceed
          const status = res.status;
          expect(
            status,
            `GET ${rel} should not return 5xx`
          ).to.be.lessThan(500);
          cy.log(`GET ${rel} -> ${status}`);
        });
      });
    });
  });
});


