/**
 * FIXED API Tests for Password-reset Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.919Z
 * Endpoints: 2
 */

describe('✅ Password-reset Module - ALL 200s', () => {
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
    it('should return 200 for POST ${this.baseURL}/password-reset/confirm', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/password-reset/confirm',
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
        expect(response.status, `Expected 200-series for POST test-id/password-reset/confirm`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/password-reset/confirm: ${response.status}`);
      });
    });

    it('should return 200 for POST ${this.baseURL}/password-reset/request', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/password-reset/request',
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
        expect(response.status, `Expected 200-series for POST test-id/password-reset/request`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/password-reset/request: ${response.status}`);
      });
    });

  });

});
