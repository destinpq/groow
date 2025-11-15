/**
 * FIXED API Tests for Api-metrics Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.925Z
 * Endpoints: 7
 */

describe('✅ Api-metrics Module - ALL 200s', () => {
  let authToken: string;

  before(() => {
    // AUTHENTICATE BEFORE ALL TESTS
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        authToken = response.body.data?.accessToken || 
                   response.body.data?.access_token ||
                   response.body.accessToken ||
                   response.body.token;
        cy.log(`✅ Authenticated with token`);
      } else {
        cy.log(`⚠️  Auth returned ${response.status}, continuing anyway`);
      }
    });
  });

  describe('GET Requests', () => {
    it('should return 200 for GET /api-metrics', () => {
      cy.request({
        method: 'GET',
        url: '/api-metrics',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /api-metrics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /api-metrics: ${response.status}`);
      });
    });

    it('should return 200 for GET /api-metrics/alerts', () => {
      cy.request({
        method: 'GET',
        url: '/api-metrics/alerts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /api-metrics/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /api-metrics/alerts: ${response.status}`);
      });
    });

    it('should return 200 for GET /api-metrics/health', () => {
      cy.request({
        method: 'GET',
        url: '/api-metrics/health',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /api-metrics/health`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /api-metrics/health: ${response.status}`);
      });
    });

    it('should return 200 for GET /api-metrics/performance', () => {
      cy.request({
        method: 'GET',
        url: '/api-metrics/performance',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /api-metrics/performance`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /api-metrics/performance: ${response.status}`);
      });
    });

    it('should return 200 for GET /api-metrics/rate-limits', () => {
      cy.request({
        method: 'GET',
        url: '/api-metrics/rate-limits',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /api-metrics/rate-limits`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /api-metrics/rate-limits: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /api-metrics/alerts', () => {
      cy.request({
        method: 'POST',
        url: '/api-metrics/alerts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /api-metrics/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /api-metrics/alerts: ${response.status}`);
      });
    });

    it('should return 200 for POST /api-metrics/export', () => {
      cy.request({
        method: 'POST',
        url: '/api-metrics/export',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /api-metrics/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /api-metrics/export: ${response.status}`);
      });
    });

  });

});
