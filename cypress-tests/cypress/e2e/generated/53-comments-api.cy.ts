/**
 * Auto-generated API Tests for Comments Module
 * Generated: 2025-11-15T08:17:13.097Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Comments Module API Tests', () => {
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
    it('should test PATCH /comments/${commentId}/resolve', () => {
      testAPI('PATCH', '/comments/test-id/resolve', 401, 'Comments', {
        requiresAuth: false,
        description: 'PATCH /comments/${commentId}/resolve',
      });
    });

  });

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE /comments/${commentId}', () => {
      testAPI('DELETE', '/comments/test-id', 401, 'Comments', {
        requiresAuth: false,
        description: 'DELETE /comments/${commentId}',
      });
    });

  });

});
