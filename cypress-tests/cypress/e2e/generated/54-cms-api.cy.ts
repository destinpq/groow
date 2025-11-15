/**
 * Auto-generated API Tests for Cms Module
 * Generated: 2025-11-15T08:17:13.097Z
 * Endpoints: 1
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Cms Module API Tests', () => {
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

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE /cms/faqs/${id}', () => {
      testAPI('DELETE', '/cms/faqs/test-id', 401, 'Cms', {
        requiresAuth: false,
        description: 'DELETE /cms/faqs/${id}',
      });
    });

  });

});
