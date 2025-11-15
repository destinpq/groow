/**
 * Auto-generated API Tests for Guest Module
 * Generated: 2025-11-15T08:17:13.110Z
 * Endpoints: 9
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Guest Module API Tests', () => {
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

  describe('POST Requests (9 endpoints)', () => {
    it('should test POST /guest/checkout/calculate', () => {
      testAPI('POST', '/guest/checkout/calculate', 401, 'Guest', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /guest/checkout/calculate',
      });
    });

    it('should test POST /guest/checkout/initialize', () => {
      testAPI('POST', '/guest/checkout/initialize', 401, 'Guest', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /guest/checkout/initialize',
      });
    });

    it('should test POST /guest/checkout/submit', () => {
      testAPI('POST', '/guest/checkout/submit', 401, 'Guest', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /guest/checkout/submit',
      });
    });

    it('should test POST /guest/checkout/validate', () => {
      testAPI('POST', '/guest/checkout/validate', 401, 'Guest', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /guest/checkout/validate',
      });
    });

    it('should test POST /guest/convert-to-account', () => {
      testAPI('POST', '/guest/convert-to-account', 401, 'Guest', {
        requiresAuth: false,
        description: 'POST /guest/convert-to-account',
      });
    });

    it('should test POST /guest/orders/send-confirmation', () => {
      testAPI('POST', '/guest/orders/send-confirmation', 401, 'Guest', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /guest/orders/send-confirmation',
      });
    });

    it('should test POST /guest/orders/track', () => {
      testAPI('POST', '/guest/orders/track', 401, 'Guest', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /guest/orders/track',
      });
    });

    it('should test POST /guest/promo/apply', () => {
      testAPI('POST', '/guest/promo/apply', 401, 'Guest', {
        requiresAuth: false,
        description: 'POST /guest/promo/apply',
      });
    });

    it('should test POST /guest/shipping/methods', () => {
      testAPI('POST', '/guest/shipping/methods', 401, 'Guest', {
        requiresAuth: false,
        description: 'POST /guest/shipping/methods',
      });
    });

  });

});
