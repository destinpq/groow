/**
 * Auto-generated API Tests for Currencies Module
 * Generated: 2025-11-15T08:17:13.098Z
 * Endpoints: 34
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Currencies Module API Tests', () => {
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

  describe('GET Requests (13 endpoints)', () => {
    it('should test GET /currencies/${currencyCode}/usage', () => {
      testAPI('GET', '/currencies/test-id/usage', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/${currencyCode}/usage',
      });
    });

    it('should test GET /currencies/conversions', () => {
      testAPI('GET', '/currencies/conversions', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/conversions',
      });
    });

    it('should test GET /currencies/countries', () => {
      testAPI('GET', '/currencies/countries', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/countries',
      });
    });

    it('should test GET /currencies/exchange-rates/${fromCurrency}/${toCurrency}/history', () => {
      testAPI('GET', '/currencies/exchange-rates/test-id/test-id/history', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/exchange-rates/${fromCurrency}/${toCurrency}/history',
      });
    });

    it('should test GET /currencies/exchange-rates/export', () => {
      testAPI('GET', '/currencies/exchange-rates/export', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/exchange-rates/export',
      });
    });

    it('should test GET /currencies/export', () => {
      testAPI('GET', '/currencies/export', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/export',
      });
    });

    it('should test GET /currencies/popular', () => {
      testAPI('GET', '/currencies/popular', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/popular',
      });
    });

    it('should test GET /currencies/products/${productId}/prices', () => {
      testAPI('GET', '/currencies/products/test-id/prices', 200, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/products/${productId}/prices',
      });
    });

    it('should test GET /currencies/revenue-breakdown', () => {
      testAPI('GET', '/currencies/revenue-breakdown', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/revenue-breakdown',
      });
    });

    it('should test GET /currencies/search', () => {
      testAPI('GET', '/currencies/search', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/search',
      });
    });

    it('should test GET /currencies/settings', () => {
      testAPI('GET', '/currencies/settings', 404, 'Currencies', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /currencies/settings',
      });
    });

    it('should test GET /currencies/stats', () => {
      testAPI('GET', '/currencies/stats', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/stats',
      });
    });

    it('should test GET /currencies/suggestions', () => {
      testAPI('GET', '/currencies/suggestions', 404, 'Currencies', {
        requiresAuth: false,
        description: 'GET /currencies/suggestions',
      });
    });

  });

  describe('POST Requests (17 endpoints)', () => {
    it('should test POST /currencies/${id}/activate', () => {
      testAPI('POST', '/currencies/test-id/activate', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/${id}/activate',
      });
    });

    it('should test POST /currencies/${id}/deactivate', () => {
      testAPI('POST', '/currencies/test-id/deactivate', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/${id}/deactivate',
      });
    });

    it('should test POST /currencies/${id}/set-default', () => {
      testAPI('POST', '/currencies/test-id/set-default', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/${id}/set-default',
      });
    });

    it('should test POST /currencies/bulk-convert', () => {
      testAPI('POST', '/currencies/bulk-convert', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/bulk-convert',
      });
    });

    it('should test POST /currencies/bulk/activate', () => {
      testAPI('POST', '/currencies/bulk/activate', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/bulk/activate',
      });
    });

    it('should test POST /currencies/bulk/deactivate', () => {
      testAPI('POST', '/currencies/bulk/deactivate', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/bulk/deactivate',
      });
    });

    it('should test POST /currencies/bulk/delete', () => {
      testAPI('POST', '/currencies/bulk/delete', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/bulk/delete',
      });
    });

    it('should test POST /currencies/bulk/update-rates', () => {
      testAPI('POST', '/currencies/bulk/update-rates', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/bulk/update-rates',
      });
    });

    it('should test POST /currencies/detect', () => {
      testAPI('POST', '/currencies/detect', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/detect',
      });
    });

    it('should test POST /currencies/exchange-rates/refresh', () => {
      testAPI('POST', '/currencies/exchange-rates/refresh', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/exchange-rates/refresh',
      });
    });

    it('should test POST /currencies/format', () => {
      testAPI('POST', '/currencies/format', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/format',
      });
    });

    it('should test POST /currencies/import', () => {
      testAPI('POST', '/currencies/import', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/import',
      });
    });

    it('should test POST /currencies/parse', () => {
      testAPI('POST', '/currencies/parse', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/parse',
      });
    });

    it('should test POST /currencies/products/bulk-update-prices', () => {
      testAPI('POST', '/currencies/products/bulk-update-prices', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/products/bulk-update-prices',
      });
    });

    it('should test POST /currencies/products/sync-prices', () => {
      testAPI('POST', '/currencies/products/sync-prices', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/products/sync-prices',
      });
    });

    it('should test POST /currencies/settings/test-provider', () => {
      testAPI('POST', '/currencies/settings/test-provider', 401, 'Currencies', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /currencies/settings/test-provider',
      });
    });

    it('should test POST /currencies/validate', () => {
      testAPI('POST', '/currencies/validate', 401, 'Currencies', {
        requiresAuth: false,
        description: 'POST /currencies/validate',
      });
    });

  });

  describe('PUT Requests (3 endpoints)', () => {
    it('should test PUT /currencies/exchange-rates/${fromCurrency}/${toCurrency}', () => {
      testAPI('PUT', '/currencies/exchange-rates/test-id/test-id', 401, 'Currencies', {
        requiresAuth: false,
        description: 'PUT /currencies/exchange-rates/${fromCurrency}/${toCurrency}',
      });
    });

    it('should test PUT /currencies/products/${productId}/prices', () => {
      testAPI('PUT', '/currencies/products/test-id/prices', 401, 'Currencies', {
        requiresAuth: false,
        description: 'PUT /currencies/products/${productId}/prices',
      });
    });

    it('should test PUT /currencies/settings', () => {
      testAPI('PUT', '/currencies/settings', 401, 'Currencies', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PUT /currencies/settings',
      });
    });

  });

  describe('DELETE Requests (1 endpoints)', () => {
    it('should test DELETE /currencies/${id}', () => {
      testAPI('DELETE', '/currencies/test-id', 401, 'Currencies', {
        requiresAuth: false,
        description: 'DELETE /currencies/${id}',
      });
    });

  });

});
