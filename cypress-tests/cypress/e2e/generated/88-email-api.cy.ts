/**
 * Auto-generated API Tests for Email Module
 * Generated: 2025-11-15T08:17:13.074Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Email Module API Tests', () => {
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
    it('should test POST ${this.baseURL}/email/resend-verification', () => {
      testAPI('POST', 'test-id/email/resend-verification', 401, 'Email', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/email/resend-verification',
      });
    });

    it('should test POST ${this.baseURL}/email/verify', () => {
      testAPI('POST', 'test-id/email/verify', 401, 'Email', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/email/verify',
      });
    });

  });

});
