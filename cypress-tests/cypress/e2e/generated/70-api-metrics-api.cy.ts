/**
 * Auto-generated API Tests for Api-metrics Module
 * Generated: 2025-11-15T08:17:13.087Z
 * Endpoints: 7
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Api-metrics Module API Tests', () => {
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

  describe('GET Requests (5 endpoints)', () => {
    it('should test GET /api-metrics', () => {
      testAPI('GET', '/api-metrics', 404, 'Api-metrics', {
        requiresAuth: false,
        description: 'GET /api-metrics',
      });
    });

    it('should test GET /api-metrics/alerts', () => {
      testAPI('GET', '/api-metrics/alerts', 404, 'Api-metrics', {
        requiresAuth: false,
        description: 'GET /api-metrics/alerts',
      });
    });

    it('should test GET /api-metrics/health', () => {
      testAPI('GET', '/api-metrics/health', 404, 'Api-metrics', {
        requiresAuth: false,
        description: 'GET /api-metrics/health',
      });
    });

    it('should test GET /api-metrics/performance', () => {
      testAPI('GET', '/api-metrics/performance', 404, 'Api-metrics', {
        requiresAuth: false,
        description: 'GET /api-metrics/performance',
      });
    });

    it('should test GET /api-metrics/rate-limits', () => {
      testAPI('GET', '/api-metrics/rate-limits', 404, 'Api-metrics', {
        requiresAuth: false,
        description: 'GET /api-metrics/rate-limits',
      });
    });

  });

  describe('POST Requests (2 endpoints)', () => {
    it('should test POST /api-metrics/alerts', () => {
      testAPI('POST', '/api-metrics/alerts', 401, 'Api-metrics', {
        requiresAuth: false,
        description: 'POST /api-metrics/alerts',
      });
    });

    it('should test POST /api-metrics/export', () => {
      testAPI('POST', '/api-metrics/export', 401, 'Api-metrics', {
        requiresAuth: false,
        description: 'POST /api-metrics/export',
      });
    });

  });

});
