/**
 * Auto-generated API Tests for Performance Module
 * Generated: 2025-11-15T08:17:13.118Z
 * Endpoints: 10
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Performance Module API Tests', () => {
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

  describe('GET Requests (7 endpoints)', () => {
    it('should test GET /performance/alerts', () => {
      testAPI('GET', '/performance/alerts', 404, 'Performance', {
        requiresAuth: false,
        description: 'GET /performance/alerts',
      });
    });

    it('should test GET /performance/application-metrics', () => {
      testAPI('GET', '/performance/application-metrics', 404, 'Performance', {
        requiresAuth: false,
        description: 'GET /performance/application-metrics',
      });
    });

    it('should test GET /performance/database-metrics', () => {
      testAPI('GET', '/performance/database-metrics', 404, 'Performance', {
        requiresAuth: false,
        description: 'GET /performance/database-metrics',
      });
    });

    it('should test GET /performance/overview', () => {
      testAPI('GET', '/performance/overview', 404, 'Performance', {
        requiresAuth: false,
        description: 'GET /performance/overview',
      });
    });

    it('should test GET /performance/recommendations', () => {
      testAPI('GET', '/performance/recommendations', 404, 'Performance', {
        requiresAuth: false,
        description: 'GET /performance/recommendations',
      });
    });

    it('should test GET /performance/system-metrics', () => {
      testAPI('GET', '/performance/system-metrics', 404, 'Performance', {
        requiresAuth: false,
        description: 'GET /performance/system-metrics',
      });
    });

    it('should test GET /performance/tests/${testId}/results', () => {
      testAPI('GET', '/performance/tests/test-id/results', 404, 'Performance', {
        requiresAuth: false,
        description: 'GET /performance/tests/${testId}/results',
      });
    });

  });

  describe('POST Requests (2 endpoints)', () => {
    it('should test POST /performance/reports', () => {
      testAPI('POST', '/performance/reports', 401, 'Performance', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /performance/reports',
      });
    });

    it('should test POST /performance/tests', () => {
      testAPI('POST', '/performance/tests', 401, 'Performance', {
        requiresAuth: false,
        description: 'POST /performance/tests',
      });
    });

  });

  describe('PUT Requests (1 endpoints)', () => {
    it('should test PUT /performance/recommendations/${recommendationId}/status', () => {
      testAPI('PUT', '/performance/recommendations/test-id/status', 401, 'Performance', {
        requiresAuth: false,
        description: 'PUT /performance/recommendations/${recommendationId}/status',
      });
    });

  });

});
