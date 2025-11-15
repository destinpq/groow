/**
 * Auto-generated API Tests for Rfq Module
 * Generated: 2025-11-15T08:17:13.120Z
 * Endpoints: 1
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Rfq Module API Tests', () => {
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

  describe('GET Requests (1 endpoints)', () => {
    it('should test GET /rfq/attachments/download', () => {
      testAPI('GET', '/rfq/attachments/download', 404, 'Rfq', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /rfq/attachments/download',
      });
    });

  });

});
