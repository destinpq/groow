/**
 * Auto-generated API Tests for Wishlists Module
 * Generated: 2025-11-15T08:17:13.131Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Wishlists Module API Tests', () => {
  let authToken: string;

  before(() => {
    // Get auth token if needed
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200 && response.body.data?.accessToken) {
        authToken = response.body.data.accessToken;
      }
    });
  });

  describe('DELETE Requests (2 endpoints)', () => {
    it('should test DELETE /wishlists/named/${wishlistId}', () => {
      testAPI('DELETE', '/wishlists/named/test-id', 401, 'Wishlists', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /wishlists/named/${wishlistId}',
      });
    });

    it('should test DELETE /wishlists/named/${wishlistId}/items/${itemId}', () => {
      testAPI('DELETE', '/wishlists/named/test-id/items/test-id', 401, 'Wishlists', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /wishlists/named/${wishlistId}/items/${itemId}',
      });
    });

  });

});
