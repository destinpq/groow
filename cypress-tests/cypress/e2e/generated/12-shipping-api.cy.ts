/**
 * Auto-generated API Tests for Shipping Module
 * Generated: 2025-11-15T08:17:13.121Z
 * Endpoints: 5
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Shipping Module API Tests', () => {
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
    it('should test GET /shipping/labels/${id}/download', () => {
      testAPI('GET', '/shipping/labels/test-id/download', 404, 'Shipping', {
        requiresAuth: false,
        description: 'GET /shipping/labels/${id}/download',
      });
    });

    it('should test GET /shipping/manifests/${id}/download', () => {
      testAPI('GET', '/shipping/manifests/test-id/download', 404, 'Shipping', {
        requiresAuth: false,
        description: 'GET /shipping/manifests/${id}/download',
      });
    });

  });

  describe('DELETE Requests (3 endpoints)', () => {
    it('should test DELETE /shipping/carriers/${id}', () => {
      testAPI('DELETE', '/shipping/carriers/test-id', 401, 'Shipping', {
        requiresAuth: false,
        description: 'DELETE /shipping/carriers/${id}',
      });
    });

    it('should test DELETE /shipping/methods/${id}', () => {
      testAPI('DELETE', '/shipping/methods/test-id', 401, 'Shipping', {
        requiresAuth: false,
        description: 'DELETE /shipping/methods/${id}',
      });
    });

    it('should test DELETE /shipping/zones/${id}', () => {
      testAPI('DELETE', '/shipping/zones/test-id', 401, 'Shipping', {
        requiresAuth: false,
        description: 'DELETE /shipping/zones/${id}',
      });
    });

  });

});
