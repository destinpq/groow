/**
 * Auto-generated API Tests for Shopping-lists Module
 * Generated: 2025-11-15T08:17:13.121Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Shopping-lists Module API Tests', () => {
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

  describe('DELETE Requests (2 endpoints)', () => {
    it('should test DELETE /shopping-lists/${id}', () => {
      testAPI('DELETE', '/shopping-lists/test-id', 401, 'Shopping-lists', {
        requiresAuth: false,
        description: 'DELETE /shopping-lists/${id}',
      });
    });

    it('should test DELETE /shopping-lists/${listId}/items/${itemId}', () => {
      testAPI('DELETE', '/shopping-lists/test-id/items/test-id', 401, 'Shopping-lists', {
        requiresAuth: false,
        description: 'DELETE /shopping-lists/${listId}/items/${itemId}',
      });
    });

  });

});
