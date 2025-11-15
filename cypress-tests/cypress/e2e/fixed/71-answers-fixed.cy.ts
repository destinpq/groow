/**
 * FIXED API Tests for Answers Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.925Z
 * Endpoints: 2
 */

describe('✅ Answers Module - ALL 200s', () => {
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
    it('should return 200 for POST /answers/${answerId}/accept', () => {
      cy.request({
        method: 'POST',
        url: '/answers/test-id/accept',
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
        expect(response.status, `Expected 200-series for POST /answers/test-id/accept`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /answers/test-id/accept: ${response.status}`);
      });
    });

    it('should return 200 for POST /answers/${answerId}/vote', () => {
      cy.request({
        method: 'POST',
        url: '/answers/test-id/vote',
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
        expect(response.status, `Expected 200-series for POST /answers/test-id/vote`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /answers/test-id/vote: ${response.status}`);
      });
    });

  });

});
