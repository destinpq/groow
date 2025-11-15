/**
 * FIXED API Tests for Shipping Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.963Z
 * Endpoints: 5
 */

describe('✅ Shipping Module - ALL 200s', () => {
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
    it('should return 200 for GET /shipping/labels/${id}/download', () => {
      cy.request({
        method: 'GET',
        url: '/shipping/labels/test-id/download',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /shipping/labels/test-id/download`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /shipping/labels/test-id/download: ${response.status}`);
      });
    });

    it('should return 200 for GET /shipping/manifests/${id}/download', () => {
      cy.request({
        method: 'GET',
        url: '/shipping/manifests/test-id/download',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /shipping/manifests/test-id/download`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /shipping/manifests/test-id/download: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /shipping/carriers/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/shipping/carriers/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /shipping/carriers/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /shipping/carriers/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /shipping/methods/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/shipping/methods/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /shipping/methods/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /shipping/methods/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /shipping/zones/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/shipping/zones/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /shipping/zones/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /shipping/zones/test-id: ${response.status}`);
      });
    });

  });

});
