/**
 * Auto-generated API Tests for Flash-sales Module
 * Generated: 2025-11-15T08:17:13.105Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Flash-sales Module API Tests', () => {
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
    it('should test POST /flash-sales/bulk/export', () => {
      testAPI('POST', '/flash-sales/bulk/export', 401, 'Flash-sales', {
        requiresAuth: false,
        description: 'POST /flash-sales/bulk/export',
      });
    });

    it('should test POST /flash-sales/service-campaigns/${flashSaleId}/analytics/export', () => {
      testAPI('POST', '/flash-sales/service-campaigns/test-id/analytics/export', 401, 'Flash-sales', {
        requiresAuth: false,
        description: 'POST /flash-sales/service-campaigns/${flashSaleId}/analytics/export',
      });
    });

  });

});
