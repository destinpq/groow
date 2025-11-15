/**
 * Auto-generated API Tests for Cloud Module
 * Generated: 2025-11-15T08:17:13.097Z
 * Endpoints: 19
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Cloud Module API Tests', () => {
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

  describe('GET Requests (8 endpoints)', () => {
    it('should test GET /cloud/backups', () => {
      testAPI('GET', '/cloud/backups', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/backups',
      });
    });

    it('should test GET /cloud/cost-analysis', () => {
      testAPI('GET', '/cloud/cost-analysis', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/cost-analysis',
      });
    });

    it('should test GET /cloud/overview', () => {
      testAPI('GET', '/cloud/overview', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/overview',
      });
    });

    it('should test GET /cloud/pipelines', () => {
      testAPI('GET', '/cloud/pipelines', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/pipelines',
      });
    });

    it('should test GET /cloud/pipelines/${pipelineId}/runs/${runId}', () => {
      testAPI('GET', '/cloud/pipelines/test-id/runs/test-id', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/pipelines/${pipelineId}/runs/${runId}',
      });
    });

    it('should test GET /cloud/providers', () => {
      testAPI('GET', '/cloud/providers', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/providers',
      });
    });

    it('should test GET /cloud/resources', () => {
      testAPI('GET', '/cloud/resources', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/resources',
      });
    });

    it('should test GET /cloud/resources/${resourceId}/metrics', () => {
      testAPI('GET', '/cloud/resources/test-id/metrics', 404, 'Cloud', {
        requiresAuth: false,
        description: 'GET /cloud/resources/${resourceId}/metrics',
      });
    });

  });

  describe('POST Requests (9 endpoints)', () => {
    it('should test POST /cloud/backups', () => {
      testAPI('POST', '/cloud/backups', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/backups',
      });
    });

    it('should test POST /cloud/backups/${backupId}/restore', () => {
      testAPI('POST', '/cloud/backups/test-id/restore', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/backups/${backupId}/restore',
      });
    });

    it('should test POST /cloud/backups/${backupId}/trigger', () => {
      testAPI('POST', '/cloud/backups/test-id/trigger', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/backups/${backupId}/trigger',
      });
    });

    it('should test POST /cloud/pipelines', () => {
      testAPI('POST', '/cloud/pipelines', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/pipelines',
      });
    });

    it('should test POST /cloud/pipelines/${pipelineId}/trigger', () => {
      testAPI('POST', '/cloud/pipelines/test-id/trigger', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/pipelines/${pipelineId}/trigger',
      });
    });

    it('should test POST /cloud/providers', () => {
      testAPI('POST', '/cloud/providers', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/providers',
      });
    });

    it('should test POST /cloud/providers/${providerId}/test', () => {
      testAPI('POST', '/cloud/providers/test-id/test', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/providers/${providerId}/test',
      });
    });

    it('should test POST /cloud/resources', () => {
      testAPI('POST', '/cloud/resources', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/resources',
      });
    });

    it('should test POST /cloud/resources/${resourceId}/control', () => {
      testAPI('POST', '/cloud/resources/test-id/control', 401, 'Cloud', {
        requiresAuth: false,
        description: 'POST /cloud/resources/${resourceId}/control',
      });
    });

  });

  describe('PUT Requests (2 endpoints)', () => {
    it('should test PUT /cloud/providers/${providerId}', () => {
      testAPI('PUT', '/cloud/providers/test-id', 401, 'Cloud', {
        requiresAuth: false,
        description: 'PUT /cloud/providers/${providerId}',
      });
    });

    it('should test PUT /cloud/resources/${resourceId}', () => {
      testAPI('PUT', '/cloud/resources/test-id', 401, 'Cloud', {
        requiresAuth: false,
        description: 'PUT /cloud/resources/${resourceId}',
      });
    });

  });

});
