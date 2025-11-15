/**
 * Auto-generated API Tests for Dashboards Module
 * Generated: 2025-11-15T08:17:13.101Z
 * Endpoints: 17
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Dashboards Module API Tests', () => {
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

  describe('GET Requests (5 endpoints)', () => {
    it('should test GET /dashboards/${dashboardId}/performance', () => {
      testAPI('GET', '/dashboards/test-id/performance', 404, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /dashboards/${dashboardId}/performance',
      });
    });

    it('should test GET /dashboards/analytics', () => {
      testAPI('GET', '/dashboards/analytics', 200, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /dashboards/analytics',
      });
    });

    it('should test GET /dashboards/analytics/popular', () => {
      testAPI('GET', '/dashboards/analytics/popular', 200, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /dashboards/analytics/popular',
      });
    });

    it('should test GET /dashboards/health', () => {
      testAPI('GET', '/dashboards/health', 404, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /dashboards/health',
      });
    });

    it('should test GET /dashboards/templates', () => {
      testAPI('GET', '/dashboards/templates', 404, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /dashboards/templates',
      });
    });

  });

  describe('POST Requests (8 endpoints)', () => {
    it('should test POST /dashboards/${dashboardId}/embed', () => {
      testAPI('POST', '/dashboards/test-id/embed', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/${dashboardId}/embed',
      });
    });

    it('should test POST /dashboards/${id}/export', () => {
      testAPI('POST', '/dashboards/test-id/export', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/${id}/export',
      });
    });

    it('should test POST /dashboards/bulk-delete', () => {
      testAPI('POST', '/dashboards/bulk-delete', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/bulk-delete',
      });
    });

    it('should test POST /dashboards/bulk-update', () => {
      testAPI('POST', '/dashboards/bulk-update', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/bulk-update',
      });
    });

    it('should test POST /dashboards/cache/clear', () => {
      testAPI('POST', '/dashboards/cache/clear', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/cache/clear',
      });
    });

    it('should test POST /dashboards/cache/refresh', () => {
      testAPI('POST', '/dashboards/cache/refresh', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/cache/refresh',
      });
    });

    it('should test POST /dashboards/import', () => {
      testAPI('POST', '/dashboards/import', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/import',
      });
    });

    it('should test POST /dashboards/shared/access', () => {
      testAPI('POST', '/dashboards/shared/access', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /dashboards/shared/access',
      });
    });

  });

  describe('PATCH Requests (3 endpoints)', () => {
    it('should test PATCH /dashboards/${id}/archive', () => {
      testAPI('PATCH', '/dashboards/test-id/archive', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PATCH /dashboards/${id}/archive',
      });
    });

    it('should test PATCH /dashboards/${id}/favorite', () => {
      testAPI('PATCH', '/dashboards/test-id/favorite', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PATCH /dashboards/${id}/favorite',
      });
    });

    it('should test PATCH /dashboards/${id}/restore', () => {
      testAPI('PATCH', '/dashboards/test-id/restore', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PATCH /dashboards/${id}/restore',
      });
    });

  });

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE /dashboards/${id}', () => {
      testAPI('DELETE', '/dashboards/test-id', 401, 'Dashboards', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /dashboards/${id}',
      });
    });

  });

});
