/**
 * Auto-generated API Tests for Payment Module
 * Generated: 2025-11-15T08:17:13.118Z
 * Endpoints: 10
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Payment Module API Tests', () => {
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

  describe('GET Requests (2 endpoints)', () => {
    it('should test GET /payment/${paymentId}/status', () => {
      testAPI('GET', '/payment/test-id/status', 404, 'Payment', {
        requiresAuth: false,
        description: 'GET /payment/${paymentId}/status',
      });
    });

    it('should test GET /payment/methods', () => {
      testAPI('GET', '/payment/methods', 404, 'Payment', {
        requiresAuth: false,
        description: 'GET /payment/methods',
      });
    });

  });

  describe('POST Requests (6 endpoints)', () => {
    it('should test POST /payment/${paymentId}/refund', () => {
      testAPI('POST', '/payment/test-id/refund', 401, 'Payment', {
        requiresAuth: false,
        description: 'POST /payment/${paymentId}/refund',
      });
    });

    it('should test POST /payment/confirm', () => {
      testAPI('POST', '/payment/confirm', 401, 'Payment', {
        requiresAuth: false,
        description: 'POST /payment/confirm',
      });
    });

    it('should test POST /payment/create-intent', () => {
      testAPI('POST', '/payment/create-intent', 401, 'Payment', {
        requiresAuth: false,
        description: 'POST /payment/create-intent',
      });
    });

    it('should test POST /payment/methods', () => {
      testAPI('POST', '/payment/methods', 401, 'Payment', {
        requiresAuth: false,
        description: 'POST /payment/methods',
      });
    });

    it('should test POST /payment/process', () => {
      testAPI('POST', '/payment/process', 401, 'Payment', {
        requiresAuth: false,
        description: 'POST /payment/process',
      });
    });

    it('should test POST /payment/webhook/${provider}', () => {
      testAPI('POST', '/payment/webhook/test-id', 401, 'Payment', {
        requiresAuth: false,
        description: 'POST /payment/webhook/${provider}',
      });
    });

  });

  describe('PUT Requests (1 endpoints)', () => {
    it('should test PUT /payment/methods/${methodId}/default', () => {
      testAPI('PUT', '/payment/methods/test-id/default', 401, 'Payment', {
        requiresAuth: false,
        description: 'PUT /payment/methods/${methodId}/default',
      });
    });

  });

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE /payment/methods/${methodId}', () => {
      testAPI('DELETE', '/payment/methods/test-id', 401, 'Payment', {
        requiresAuth: false,
        description: 'DELETE /payment/methods/${methodId}',
      });
    });

  });

});
