/**
 * FIXED API Tests for Sso Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.920Z
 * Endpoints: 3
 */

describe('✅ Sso Module - ALL 200s', () => {
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
    it('should return 200 for POST ${this.baseURL}/sso/${providerId}/initiate', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/sso/test-id/initiate',
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
        expect(response.status, `Expected 200-series for POST test-id/sso/test-id/initiate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/sso/test-id/initiate: ${response.status}`);
      });
    });

    it('should return 200 for POST ${this.baseURL}/sso/${request.provider}/callback', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/sso/test-id/callback',
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
        expect(response.status, `Expected 200-series for POST test-id/sso/test-id/callback`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/sso/test-id/callback: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE ${this.baseURL}/sso/${providerId}/unlink', () => {
      cy.request({
        method: 'DELETE',
        url: 'test-id/sso/test-id/unlink',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE test-id/sso/test-id/unlink`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE test-id/sso/test-id/unlink: ${response.status}`);
      });
    });

  });

});
