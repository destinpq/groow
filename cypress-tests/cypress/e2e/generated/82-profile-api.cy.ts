/**
 * Auto-generated API Tests for Profile Module
 * Generated: 2025-11-15T08:17:13.075Z
 * Endpoints: 1
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Profile Module API Tests', () => {
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

  describe('PATCH Requests (1 endpoints)', () => {
    it('should test PATCH ${this.baseURL}/profile', () => {
      testAPI('PATCH', 'test-id/profile', 401, 'Profile', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PATCH ${this.baseURL}/profile',
      });
    });

  });

});
