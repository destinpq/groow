/**
 * Auto-generated API Tests for Search Module
 * Generated: 2025-11-15T08:17:13.120Z
 * Endpoints: 22
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Search Module API Tests', () => {
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

  describe('GET Requests (9 endpoints)', () => {
    it('should test GET /search/analytics', () => {
      testAPI('GET', '/search/analytics', 200, 'Search', {
        requiresAuth: false,
        description: 'GET /search/analytics',
      });
    });

    it('should test GET /search/barcode', () => {
      testAPI('GET', '/search/barcode', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/barcode',
      });
    });

    it('should test GET /search/facets', () => {
      testAPI('GET', '/search/facets', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/facets',
      });
    });

    it('should test GET /search/history/${userId}', () => {
      testAPI('GET', '/search/history/test-id', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/history/${userId}',
      });
    });

    it('should test GET /search/metrics', () => {
      testAPI('GET', '/search/metrics', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/metrics',
      });
    });

    it('should test GET /search/saved', () => {
      testAPI('GET', '/search/saved', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/saved',
      });
    });

    it('should test GET /search/similar/${productId}', () => {
      testAPI('GET', '/search/similar/test-id', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/similar/${productId}',
      });
    });

    it('should test GET /search/suggestions', () => {
      testAPI('GET', '/search/suggestions', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/suggestions',
      });
    });

    it('should test GET /search/trending', () => {
      testAPI('GET', '/search/trending', 404, 'Search', {
        requiresAuth: false,
        description: 'GET /search/trending',
      });
    });

  });

  describe('POST Requests (10 endpoints)', () => {
    it('should test POST /search/bulk', () => {
      testAPI('POST', '/search/bulk', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/bulk',
      });
    });

    it('should test POST /search/export', () => {
      testAPI('POST', '/search/export', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/export',
      });
    });

    it('should test POST /search/personalized', () => {
      testAPI('POST', '/search/personalized', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/personalized',
      });
    });

    it('should test POST /search/products', () => {
      testAPI('POST', '/search/products', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/products',
      });
    });

    it('should test POST /search/saved', () => {
      testAPI('POST', '/search/saved', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/saved',
      });
    });

    it('should test POST /search/saved/${searchId}/execute', () => {
      testAPI('POST', '/search/saved/test-id/execute', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/saved/${searchId}/execute',
      });
    });

    it('should test POST /search/track', () => {
      testAPI('POST', '/search/track', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/track',
      });
    });

    it('should test POST /search/vendors/${vendorId}', () => {
      testAPI('POST', '/search/vendors/test-id', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/vendors/${vendorId}',
      });
    });

    it('should test POST /search/visual', () => {
      testAPI('POST', '/search/visual', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/visual',
      });
    });

    it('should test POST /search/voice', () => {
      testAPI('POST', '/search/voice', 401, 'Search', {
        requiresAuth: false,
        description: 'POST /search/voice',
      });
    });

  });

  describe('PUT Requests (1 endpoints)', () => {
    it('should test PUT /search/saved/${searchId}', () => {
      testAPI('PUT', '/search/saved/test-id', 401, 'Search', {
        requiresAuth: false,
        description: 'PUT /search/saved/${searchId}',
      });
    });

  });

  describe('DELETE Requests (2 endpoints)', () => {
    it('should test DELETE /search/history/${userId}', () => {
      testAPI('DELETE', '/search/history/test-id', 401, 'Search', {
        requiresAuth: false,
        description: 'DELETE /search/history/${userId}',
      });
    });

    it('should test DELETE /search/saved/${searchId}', () => {
      testAPI('DELETE', '/search/saved/test-id', 401, 'Search', {
        requiresAuth: false,
        description: 'DELETE /search/saved/${searchId}',
      });
    });

  });

});
