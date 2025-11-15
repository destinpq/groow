/**
 * Auto-generated API Tests for Logout-all Module
 * Generated: 2025-11-15T08:17:13.074Z
 * Endpoints: 1
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Logout-all Module API Tests', () => {
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
    it('should test POST ${this.baseURL}/logout-all', () => {
      testAPI('POST', 'test-id/logout-all', 401, 'Logout-all', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/logout-all',
      });
    });

  });

});
