/**
 * FIXED API Tests for Snapshots Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.963Z
 * Endpoints: 1
 */

describe('✅ Snapshots Module - ALL 200s', () => {
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
    it('should return 200 for POST /snapshots/compare', () => {
      cy.request({
        method: 'POST',
        url: '/snapshots/compare',
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
        expect(response.status, `Expected 200-series for POST /snapshots/compare`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /snapshots/compare: ${response.status}`);
      });
    });

  });

});
