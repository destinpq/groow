/**
 * Auto-generated API Tests for Api-keys Module
 * Generated: 2025-11-15T08:17:13.074Z
 * Endpoints: 3
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Api-keys Module API Tests', () => {
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

  describe('POST Requests (1 endpoints)', () => {
    it('should test POST ${this.baseURL}/api-keys', () => {
      testAPI('POST', 'test-id/api-keys', 401, 'Api-keys', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/api-keys',
      });
    });

  });

  describe('PATCH Requests (1 endpoints)', () => {
    it('should test PATCH ${this.baseURL}/api-keys/${keyId}', () => {
      testAPI('PATCH', 'test-id/api-keys/test-id', 401, 'Api-keys', {
        requiresAuth: false,
        description: 'PATCH ${this.baseURL}/api-keys/${keyId}',
      });
    });

  });

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE ${this.baseURL}/api-keys/${keyId}', () => {
      testAPI('DELETE', 'test-id/api-keys/test-id', 401, 'Api-keys', {
        requiresAuth: false,
        description: 'DELETE ${this.baseURL}/api-keys/${keyId}',
      });
    });

  });

});
