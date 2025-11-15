/**
 * Auto-generated API Tests for Affiliate Module
 * Generated: 2025-11-15T08:17:13.084Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Affiliate Module API Tests', () => {
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

  describe('GET Requests (2 endpoints)', () => {
    it('should test GET /affiliate/activity/export', () => {
      testAPI('GET', '/affiliate/activity/export', 404, 'Affiliate', {
        requiresAuth: false,
        description: 'GET /affiliate/activity/export',
      });
    });

    it('should test GET /affiliate/commissions/export', () => {
      testAPI('GET', '/affiliate/commissions/export', 404, 'Affiliate', {
        requiresAuth: false,
        description: 'GET /affiliate/commissions/export',
      });
    });

  });

});
