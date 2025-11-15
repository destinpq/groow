/**
 * Auto-generated API Tests for Devops Module
 * Generated: 2025-11-15T08:17:13.104Z
 * Endpoints: 2
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Devops Module API Tests', () => {
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
    it('should test GET /devops/pipelines', () => {
      testAPI('GET', '/devops/pipelines', 404, 'Devops', {
        requiresAuth: false,
        description: 'GET /devops/pipelines',
      });
    });

  });

  describe('POST Requests (1 endpoints)', () => {
    it('should test POST /devops/pipelines/${pipelineId}/run', () => {
      testAPI('POST', '/devops/pipelines/test-id/run', 401, 'Devops', {
        requiresAuth: false,
        description: 'POST /devops/pipelines/${pipelineId}/run',
      });
    });

  });

});
