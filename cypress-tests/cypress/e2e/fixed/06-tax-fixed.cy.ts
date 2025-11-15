/**
 * FIXED API Tests for Tax Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.964Z
 * Endpoints: 4
 */

describe('✅ Tax Module - ALL 200s', () => {
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
    it('should return 200 for GET /tax/reports/${id}/download', () => {
      cy.request({
        method: 'GET',
        url: '/tax/reports/test-id/download',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /tax/reports/test-id/download`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /tax/reports/test-id/download: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /tax/calculations/export', () => {
      cy.request({
        method: 'POST',
        url: '/tax/calculations/export',
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
        expect(response.status, `Expected 200-series for POST /tax/calculations/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /tax/calculations/export: ${response.status}`);
      });
    });

    it('should return 200 for POST /tax/rates/export', () => {
      cy.request({
        method: 'POST',
        url: '/tax/rates/export',
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
        expect(response.status, `Expected 200-series for POST /tax/rates/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /tax/rates/export: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /tax/rates/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/tax/rates/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /tax/rates/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /tax/rates/test-id: ${response.status}`);
      });
    });

  });

});
