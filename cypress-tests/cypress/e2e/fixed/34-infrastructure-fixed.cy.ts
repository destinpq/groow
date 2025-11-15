/**
 * FIXED API Tests for Infrastructure Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.941Z
 * Endpoints: 3
 */

describe('✅ Infrastructure Module - ALL 200s', () => {
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
    it('should return 200 for GET /infrastructure', () => {
      cy.request({
        method: 'GET',
        url: '/infrastructure',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /infrastructure`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /infrastructure: ${response.status}`);
      });
    });

    it('should return 200 for GET /infrastructure/${infrastructureId}/metrics', () => {
      cy.request({
        method: 'GET',
        url: '/infrastructure/test-id/metrics',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /infrastructure/test-id/metrics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /infrastructure/test-id/metrics: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /infrastructure/${infrastructureId}/alerts', () => {
      cy.request({
        method: 'POST',
        url: '/infrastructure/test-id/alerts',
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
        expect(response.status, `Expected 200-series for POST /infrastructure/test-id/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /infrastructure/test-id/alerts: ${response.status}`);
      });
    });

  });

});
