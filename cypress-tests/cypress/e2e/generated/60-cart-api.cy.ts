/**
 * Auto-generated API Tests for Cart Module
 * Generated: 2025-11-15T08:17:13.095Z
 * Endpoints: 21
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Cart Module API Tests', () => {
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

  describe('GET Requests (4 endpoints)', () => {
    it('should test GET /cart', () => {
      testAPI('GET', '/cart', 404, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /cart',
      });
    });

    it('should test GET /cart/recommendations', () => {
      testAPI('GET', '/cart/recommendations', 404, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /cart/recommendations',
      });
    });

    it('should test GET /cart/saved', () => {
      testAPI('GET', '/cart/saved', 404, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /cart/saved',
      });
    });

    it('should test GET /cart/summary', () => {
      testAPI('GET', '/cart/summary', 404, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /cart/summary',
      });
    });

  });

  describe('POST Requests (12 endpoints)', () => {
    it('should test POST /cart/check-availability', () => {
      testAPI('POST', '/cart/check-availability', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/check-availability',
      });
    });

    it('should test POST /cart/coupons', () => {
      testAPI('POST', '/cart/coupons', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/coupons',
      });
    });

    it('should test POST /cart/estimate-delivery', () => {
      testAPI('POST', '/cart/estimate-delivery', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/estimate-delivery',
      });
    });

    it('should test POST /cart/import', () => {
      testAPI('POST', '/cart/import', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/import',
      });
    });

    it('should test POST /cart/items', () => {
      testAPI('POST', '/cart/items', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/items',
      });
    });

    it('should test POST /cart/items/${itemId}/move-to-wishlist', () => {
      testAPI('POST', '/cart/items/test-id/move-to-wishlist', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/items/${itemId}/move-to-wishlist',
      });
    });

    it('should test POST /cart/merge', () => {
      testAPI('POST', '/cart/merge', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/merge',
      });
    });

    it('should test POST /cart/restore/${savedCartId}', () => {
      testAPI('POST', '/cart/restore/test-id', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/restore/${savedCartId}',
      });
    });

    it('should test POST /cart/save', () => {
      testAPI('POST', '/cart/save', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/save',
      });
    });

    it('should test POST /cart/share', () => {
      testAPI('POST', '/cart/share', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/share',
      });
    });

    it('should test POST /cart/shipping/calculate', () => {
      testAPI('POST', '/cart/shipping/calculate', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/shipping/calculate',
      });
    });

    it('should test POST /cart/validate', () => {
      testAPI('POST', '/cart/validate', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /cart/validate',
      });
    });

  });

  describe('PUT Requests (1 endpoints)', () => {
    it('should test PUT /cart/items/${itemId}', () => {
      testAPI('PUT', '/cart/items/test-id', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PUT /cart/items/${itemId}',
      });
    });

  });

  describe('DELETE Requests (4 endpoints)', () => {
    it('should test DELETE /cart', () => {
      testAPI('DELETE', '/cart', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /cart',
      });
    });

    it('should test DELETE /cart/coupons/${code}', () => {
      testAPI('DELETE', '/cart/coupons/test-id', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /cart/coupons/${code}',
      });
    });

    it('should test DELETE /cart/items/${itemId}', () => {
      testAPI('DELETE', '/cart/items/test-id', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /cart/items/${itemId}',
      });
    });

    it('should test DELETE /cart/saved/${savedCartId}', () => {
      testAPI('DELETE', '/cart/saved/test-id', 401, 'Cart', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /cart/saved/${savedCartId}',
      });
    });

  });

});
