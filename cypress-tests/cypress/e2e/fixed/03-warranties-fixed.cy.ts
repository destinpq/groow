/**
 * FIXED API Tests for Warranties Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.964Z
 * Endpoints: 3
 */

describe('✅ Warranties Module - ALL 200s', () => {
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
    it('should return 200 for GET /warranties/${warrantyId}/certificate', () => {
      cy.request({
        method: 'GET',
        url: '/warranties/test-id/certificate',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /warranties/test-id/certificate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /warranties/test-id/certificate: ${response.status}`);
      });
    });

    it('should return 200 for GET /warranties/claims/${claimId}/download', () => {
      cy.request({
        method: 'GET',
        url: '/warranties/claims/test-id/download',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /warranties/claims/test-id/download`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /warranties/claims/test-id/download: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /warranties/customers/${customerId}/preferences', () => {
      cy.request({
        method: 'PUT',
        url: '/warranties/customers/test-id/preferences',
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
        expect(response.status, `Expected 200-series for PUT /warranties/customers/test-id/preferences`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /warranties/customers/test-id/preferences: ${response.status}`);
      });
    });

  });

});
