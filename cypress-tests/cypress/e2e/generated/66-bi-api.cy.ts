/**
 * Auto-generated API Tests for Bi Module
 * Generated: 2025-11-15T08:17:13.089Z
 * Endpoints: 17
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Bi Module API Tests', () => {
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

  describe('GET Requests (9 endpoints)', () => {
    it('should test GET /bi/dashboards/${dashboardId}', () => {
      testAPI('GET', '/bi/dashboards/test-id', 404, 'Bi', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /bi/dashboards/${dashboardId}',
      });
    });

    it('should test GET /bi/forecasts', () => {
      testAPI('GET', '/bi/forecasts', 404, 'Bi', {
        requiresAuth: false,
        description: 'GET /bi/forecasts',
      });
    });

    it('should test GET /bi/insights', () => {
      testAPI('GET', '/bi/insights', 404, 'Bi', {
        requiresAuth: false,
        description: 'GET /bi/insights',
      });
    });

    it('should test GET /bi/kpis', () => {
      testAPI('GET', '/bi/kpis', 404, 'Bi', {
        requiresAuth: false,
        description: 'GET /bi/kpis',
      });
    });

    it('should test GET /bi/kpis/${kpiId}', () => {
      testAPI('GET', '/bi/kpis/test-id', 404, 'Bi', {
        requiresAuth: false,
        description: 'GET /bi/kpis/${kpiId}',
      });
    });

    it('should test GET /bi/overview', () => {
      testAPI('GET', '/bi/overview', 404, 'Bi', {
        requiresAuth: false,
        description: 'GET /bi/overview',
      });
    });

    it('should test GET /bi/reports', () => {
      testAPI('GET', '/bi/reports', 404, 'Bi', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /bi/reports',
      });
    });

    it('should test GET /bi/visualizations', () => {
      testAPI('GET', '/bi/visualizations', 404, 'Bi', {
        requiresAuth: false,
        description: 'GET /bi/visualizations',
      });
    });

    it('should test GET /bi/visualizations/${vizId}/data', () => {
      testAPI('GET', '/bi/visualizations/test-id/data', 404, 'Bi', {
        requiresAuth: false,
        description: 'GET /bi/visualizations/${vizId}/data',
      });
    });

  });

  describe('POST Requests (6 endpoints)', () => {
    it('should test POST /bi/forecasts', () => {
      testAPI('POST', '/bi/forecasts', 401, 'Bi', {
        requiresAuth: false,
        description: 'POST /bi/forecasts',
      });
    });

    it('should test POST /bi/forecasts/${forecastId}/train', () => {
      testAPI('POST', '/bi/forecasts/test-id/train', 401, 'Bi', {
        requiresAuth: false,
        description: 'POST /bi/forecasts/${forecastId}/train',
      });
    });

    it('should test POST /bi/kpis', () => {
      testAPI('POST', '/bi/kpis', 401, 'Bi', {
        requiresAuth: false,
        description: 'POST /bi/kpis',
      });
    });

    it('should test POST /bi/query', () => {
      testAPI('POST', '/bi/query', 401, 'Bi', {
        requiresAuth: false,
        description: 'POST /bi/query',
      });
    });

    it('should test POST /bi/reports/${reportId}/generate', () => {
      testAPI('POST', '/bi/reports/test-id/generate', 401, 'Bi', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /bi/reports/${reportId}/generate',
      });
    });

    it('should test POST /bi/visualizations', () => {
      testAPI('POST', '/bi/visualizations', 401, 'Bi', {
        requiresAuth: false,
        description: 'POST /bi/visualizations',
      });
    });

  });

  describe('PUT Requests (2 endpoints)', () => {
    it('should test PUT /bi/insights/${insightId}/status', () => {
      testAPI('PUT', '/bi/insights/test-id/status', 401, 'Bi', {
        requiresAuth: false,
        description: 'PUT /bi/insights/${insightId}/status',
      });
    });

    it('should test PUT /bi/kpis/${kpiId}', () => {
      testAPI('PUT', '/bi/kpis/test-id', 401, 'Bi', {
        requiresAuth: false,
        description: 'PUT /bi/kpis/${kpiId}',
      });
    });

  });

});
