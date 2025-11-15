/**
 * Auto-generated API Tests for Subscriptions Module
 * Generated: 2025-11-15T08:17:13.127Z
 * Endpoints: 4
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Subscriptions Module API Tests', () => {
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

  describe('GET Requests (4 endpoints)', () => {
    it('should test GET /subscriptions/billing/export', () => {
      testAPI('GET', '/subscriptions/billing/export', 404, 'Subscriptions', {
        requiresAuth: false,
        description: 'GET /subscriptions/billing/export',
      });
    });

    it('should test GET /subscriptions/billing/invoices/${invoiceId}/download', () => {
      testAPI('GET', '/subscriptions/billing/invoices/test-id/download', 404, 'Subscriptions', {
        requiresAuth: false,
        description: 'GET /subscriptions/billing/invoices/${invoiceId}/download',
      });
    });

    it('should test GET /subscriptions/export', () => {
      testAPI('GET', '/subscriptions/export', 404, 'Subscriptions', {
        requiresAuth: false,
        description: 'GET /subscriptions/export',
      });
    });

    it('should test GET /subscriptions/usage/export', () => {
      testAPI('GET', '/subscriptions/usage/export', 404, 'Subscriptions', {
        requiresAuth: false,
        description: 'GET /subscriptions/usage/export',
      });
    });

  });

});
