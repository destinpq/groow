/**
 * Auto-generated API Tests for Categories Module
 * Generated: 2025-11-15T08:17:13.096Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Categories Module API Tests', () => {
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
    it('should test PATCH /categories/${categoryId}/reorder', () => {
      testAPI('PATCH', '/categories/test-id/reorder', 401, 'Categories', {
        requiresAuth: false,
        description: 'PATCH /categories/${categoryId}/reorder',
      });
    });

  });

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE /categories/${id}', () => {
      testAPI('DELETE', '/categories/test-id', 401, 'Categories', {
        requiresAuth: false,
        description: 'DELETE /categories/${id}',
      });
    });

  });

});
