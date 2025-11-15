/**
 * Auto-generated API Tests for Auth Module
 * Generated: 2025-11-15T08:17:13.064Z
 * Endpoints: 38
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Auth Module API Tests', () => {
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

  describe('GET Requests (7 endpoints)', () => {
    it('should test GET /auth/attempts', () => {
      testAPI('GET', '/auth/attempts', 401, 'Auth', {
        requiresAuth: false,
        description: 'GET /auth/attempts',
      });
    });

    it('should test GET /auth/devices', () => {
      testAPI('GET', '/auth/devices', 401, 'Auth', {
        requiresAuth: false,
        description: 'GET /auth/devices',
      });
    });

    it('should test GET /auth/me', () => {
      testAPI('GET', '/auth/me', 401, 'Auth', {
        requiresAuth: false,
        description: 'GET /auth/me',
      });
    });

    it('should test GET /auth/profile', () => {
      testAPI('GET', '/auth/profile', 401, 'Auth', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /auth/profile',
      });
    });

    it('should test GET /auth/providers', () => {
      testAPI('GET', '/auth/providers', 401, 'Auth', {
        requiresAuth: false,
        description: 'GET /auth/providers',
      });
    });

    it('should test GET /auth/sessions', () => {
      testAPI('GET', '/auth/sessions', 401, 'Auth', {
        requiresAuth: false,
        description: 'GET /auth/sessions',
      });
    });

    it('should test GET /auth/tokens', () => {
      testAPI('GET', '/auth/tokens', 401, 'Auth', {
        requiresAuth: false,
        description: 'GET /auth/tokens',
      });
    });

  });

  describe('POST Requests (25 endpoints)', () => {
    it('should test POST ${API_BASE_URL}/auth/refresh', () => {
      testAPI('POST', 'test-id/auth/refresh', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST ${API_BASE_URL}/auth/refresh',
      });
    });

    it('should test POST ${this.baseURL}/auth/login', () => {
      testAPI('POST', 'test-id/auth/login', 400, 'Auth', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/auth/login',
      });
    });

    it('should test POST ${this.baseURL}/auth/logout', () => {
      testAPI('POST', 'test-id/auth/logout', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/auth/logout',
      });
    });

    it('should test POST ${this.baseURL}/auth/refresh', () => {
      testAPI('POST', 'test-id/auth/refresh', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/auth/refresh',
      });
    });

    it('should test POST ${this.baseURL}/auth/register', () => {
      testAPI('POST', 'test-id/auth/register', 400, 'Auth', {
        requiresAuth: false,
        description: 'POST ${this.baseURL}/auth/register',
      });
    });

    it('should test POST /auth/change-password', () => {
      testAPI('POST', '/auth/change-password', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/change-password',
      });
    });

    it('should test POST /auth/delete-account', () => {
      testAPI('POST', '/auth/delete-account', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/delete-account',
      });
    });

    it('should test POST /auth/devices', () => {
      testAPI('POST', '/auth/devices', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/devices',
      });
    });

    it('should test POST /auth/login', () => {
      testAPI('POST', '/auth/login', 400, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/login',
      });
    });

    it('should test POST /auth/logout', () => {
      testAPI('POST', '/auth/logout', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/logout',
      });
    });

    it('should test POST /auth/magic-links', () => {
      testAPI('POST', '/auth/magic-links', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/magic-links',
      });
    });

    it('should test POST /auth/magic-links/validate', () => {
      testAPI('POST', '/auth/magic-links/validate', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/magic-links/validate',
      });
    });

    it('should test POST /auth/mfa/disable', () => {
      testAPI('POST', '/auth/mfa/disable', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/mfa/disable',
      });
    });

    it('should test POST /auth/mfa/setup', () => {
      testAPI('POST', '/auth/mfa/setup', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/mfa/setup',
      });
    });

    it('should test POST /auth/mfa/verify-setup', () => {
      testAPI('POST', '/auth/mfa/verify-setup', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/mfa/verify-setup',
      });
    });

    it('should test POST /auth/password-change', () => {
      testAPI('POST', '/auth/password-change', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/password-change',
      });
    });

    it('should test POST /auth/password-reset/complete', () => {
      testAPI('POST', '/auth/password-reset/complete', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/password-reset/complete',
      });
    });

    it('should test POST /auth/password-reset/initiate', () => {
      testAPI('POST', '/auth/password-reset/initiate', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/password-reset/initiate',
      });
    });

    it('should test POST /auth/refresh', () => {
      testAPI('POST', '/auth/refresh', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/refresh',
      });
    });

    it('should test POST /auth/register', () => {
      testAPI('POST', '/auth/register', 400, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/register',
      });
    });

    it('should test POST /auth/social/callback', () => {
      testAPI('POST', '/auth/social/callback', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/social/callback',
      });
    });

    it('should test POST /auth/social/initiate', () => {
      testAPI('POST', '/auth/social/initiate', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/social/initiate',
      });
    });

    it('should test POST /auth/social/link', () => {
      testAPI('POST', '/auth/social/link', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/social/link',
      });
    });

    it('should test POST /auth/tokens', () => {
      testAPI('POST', '/auth/tokens', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/tokens',
      });
    });

    it('should test POST /auth/verify', () => {
      testAPI('POST', '/auth/verify', 401, 'Auth', {
        requiresAuth: false,
        description: 'POST /auth/verify',
      });
    });

  });

  describe('PUT Requests (2 endpoints)', () => {
    it('should test PUT /auth/devices/${deviceId}/trust', () => {
      testAPI('PUT', '/auth/devices/test-id/trust', 401, 'Auth', {
        requiresAuth: false,
        description: 'PUT /auth/devices/${deviceId}/trust',
      });
    });

    it('should test PUT /auth/profile', () => {
      testAPI('PUT', '/auth/profile', 401, 'Auth', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PUT /auth/profile',
      });
    });

  });

  describe('DELETE Requests (4 endpoints)', () => {
    it('should test DELETE /auth/devices/${deviceId}', () => {
      testAPI('DELETE', '/auth/devices/test-id', 401, 'Auth', {
        requiresAuth: false,
        description: 'DELETE /auth/devices/${deviceId}',
      });
    });

    it('should test DELETE /auth/sessions/${sessionId}', () => {
      testAPI('DELETE', '/auth/sessions/test-id', 401, 'Auth', {
        requiresAuth: false,
        description: 'DELETE /auth/sessions/${sessionId}',
      });
    });

    it('should test DELETE /auth/social/${provider}', () => {
      testAPI('DELETE', '/auth/social/test-id', 401, 'Auth', {
        requiresAuth: false,
        description: 'DELETE /auth/social/${provider}',
      });
    });

    it('should test DELETE /auth/tokens/${tokenId}', () => {
      testAPI('DELETE', '/auth/tokens/test-id', 401, 'Auth', {
        requiresAuth: false,
        description: 'DELETE /auth/tokens/${tokenId}',
      });
    });

  });

});
