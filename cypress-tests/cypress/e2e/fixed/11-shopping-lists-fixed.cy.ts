/**
 * FIXED API Tests for Shopping-lists Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.963Z
 * Endpoints: 2
 */

describe('✅ Shopping-lists Module - ALL 200s', () => {
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

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /shopping-lists/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/shopping-lists/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /shopping-lists/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /shopping-lists/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /shopping-lists/${listId}/items/${itemId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/shopping-lists/test-id/items/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /shopping-lists/test-id/items/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /shopping-lists/test-id/items/test-id: ${response.status}`);
      });
    });

  });

});
