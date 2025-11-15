/**
 * FIXED API Tests for Subscriptions Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.964Z
 * Endpoints: 4
 */

describe('✅ Subscriptions Module - ALL 200s', () => {
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
    it('should return 200 for GET /subscriptions/billing/export', () => {
      cy.request({
        method: 'GET',
        url: '/subscriptions/billing/export',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /subscriptions/billing/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /subscriptions/billing/export: ${response.status}`);
      });
    });

    it('should return 200 for GET /subscriptions/billing/invoices/${invoiceId}/download', () => {
      cy.request({
        method: 'GET',
        url: '/subscriptions/billing/invoices/test-id/download',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /subscriptions/billing/invoices/test-id/download`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /subscriptions/billing/invoices/test-id/download: ${response.status}`);
      });
    });

    it('should return 200 for GET /subscriptions/export', () => {
      cy.request({
        method: 'GET',
        url: '/subscriptions/export',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /subscriptions/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /subscriptions/export: ${response.status}`);
      });
    });

    it('should return 200 for GET /subscriptions/usage/export', () => {
      cy.request({
        method: 'GET',
        url: '/subscriptions/usage/export',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /subscriptions/usage/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /subscriptions/usage/export: ${response.status}`);
      });
    });

  });

});
