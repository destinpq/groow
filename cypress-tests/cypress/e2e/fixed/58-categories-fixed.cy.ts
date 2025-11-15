/**
 * FIXED API Tests for Categories Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.931Z
 * Endpoints: 2
 */

describe('✅ Categories Module - ALL 200s', () => {
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

  describe('PATCH Requests', () => {
    it('should return 200 for PATCH /categories/${categoryId}/reorder', () => {
      cy.request({
        method: 'PATCH',
        url: '/categories/test-id/reorder',
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
        expect(response.status, `Expected 200-series for PATCH /categories/test-id/reorder`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /categories/test-id/reorder: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /categories/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/categories/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /categories/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /categories/test-id: ${response.status}`);
      });
    });

  });

});
