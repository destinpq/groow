/**
 * Auto-generated API Tests for Sso Module
 * Generated: 2025-11-15T08:17:13.080Z
 * Endpoints: 3
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Sso Module API Tests', () => {
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

  describe('POST Requests (2 endpoints)', () => {
    it('should test POST ${this.baseURL}/sso/${providerId}/initiate', () => {
      testAPI('POST', 'test-id/sso/test-id/initiate', 401, 'Sso', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/sso/${providerId}/initiate',
      });
    });

    it('should test POST ${this.baseURL}/sso/${request.provider}/callback', () => {
      testAPI('POST', 'test-id/sso/test-id/callback', 401, 'Sso', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/sso/${request.provider}/callback',
      });
    });

  });

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE ${this.baseURL}/sso/${providerId}/unlink', () => {
      testAPI('DELETE', 'test-id/sso/test-id/unlink', 401, 'Sso', {
        requiresAuth: false,
        description: 'DELETE ${this.baseURL}/sso/${providerId}/unlink',
      });
    });

  });

});
