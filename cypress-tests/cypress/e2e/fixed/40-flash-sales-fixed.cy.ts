/**
 * FIXED API Tests for Flash-sales Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.940Z
 * Endpoints: 2
 */

describe('✅ Flash-sales Module - ALL 200s', () => {
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

  describe('POST Requests', () => {
    it('should return 200 for POST /flash-sales/bulk/export', () => {
      cy.request({
        method: 'POST',
        url: '/flash-sales/bulk/export',
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
        expect(response.status, `Expected 200-series for POST /flash-sales/bulk/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /flash-sales/bulk/export: ${response.status}`);
      });
    });

    it('should return 200 for POST /flash-sales/service-campaigns/${flashSaleId}/analytics/export', () => {
      cy.request({
        method: 'POST',
        url: '/flash-sales/service-campaigns/test-id/analytics/export',
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
        expect(response.status, `Expected 200-series for POST /flash-sales/service-campaigns/test-id/analytics/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /flash-sales/service-campaigns/test-id/analytics/export: ${response.status}`);
      });
    });

  });

});
