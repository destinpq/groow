/**
 * Auto-generated API Tests for Seo Module
 * Generated: 2025-11-15T08:17:13.120Z
 * Endpoints: 48
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Seo Module API Tests', () => {
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

  describe('GET Requests (18 endpoints)', () => {
    it('should test GET /seo/analytics', () => {
      testAPI('GET', '/seo/analytics', 200, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/analytics',
      });
    });

    it('should test GET /seo/analytics/top-keywords', () => {
      testAPI('GET', '/seo/analytics/top-keywords', 200, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/analytics/top-keywords',
      });
    });

    it('should test GET /seo/analytics/top-pages', () => {
      testAPI('GET', '/seo/analytics/top-pages', 200, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/analytics/top-pages',
      });
    });

    it('should test GET /seo/audits', () => {
      testAPI('GET', '/seo/audits', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/audits',
      });
    });

    it('should test GET /seo/audits/${id}', () => {
      testAPI('GET', '/seo/audits/test-id', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/audits/${id}',
      });
    });

    it('should test GET /seo/competitors', () => {
      testAPI('GET', '/seo/competitors', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/competitors',
      });
    });

    it('should test GET /seo/keywords', () => {
      testAPI('GET', '/seo/keywords', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/keywords',
      });
    });

    it('should test GET /seo/keywords/suggestions', () => {
      testAPI('GET', '/seo/keywords/suggestions', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/keywords/suggestions',
      });
    });

    it('should test GET /seo/meta-tags', () => {
      testAPI('GET', '/seo/meta-tags', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/meta-tags',
      });
    });

    it('should test GET /seo/meta-tags/${id}', () => {
      testAPI('GET', '/seo/meta-tags/test-id', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/meta-tags/${id}',
      });
    });

    it('should test GET /seo/meta-tags/by-url', () => {
      testAPI('GET', '/seo/meta-tags/by-url', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/meta-tags/by-url',
      });
    });

    it('should test GET /seo/redirects', () => {
      testAPI('GET', '/seo/redirects', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/redirects',
      });
    });

    it('should test GET /seo/robots.txt', () => {
      testAPI('GET', '/seo/robots.txt', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/robots.txt',
      });
    });

    it('should test GET /seo/schema-markup', () => {
      testAPI('GET', '/seo/schema-markup', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/schema-markup',
      });
    });

    it('should test GET /seo/settings', () => {
      testAPI('GET', '/seo/settings', 404, 'Seo', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /seo/settings',
      });
    });

    it('should test GET /seo/sitemap.xml', () => {
      testAPI('GET', '/seo/sitemap.xml', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/sitemap.xml',
      });
    });

    it('should test GET /seo/sitemap/entries', () => {
      testAPI('GET', '/seo/sitemap/entries', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/sitemap/entries',
      });
    });

    it('should test GET /seo/templates', () => {
      testAPI('GET', '/seo/templates', 404, 'Seo', {
        requiresAuth: false,
        description: 'GET /seo/templates',
      });
    });

  });

  describe('POST Requests (15 endpoints)', () => {
    it('should test POST /seo/audits', () => {
      testAPI('POST', '/seo/audits', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/audits',
      });
    });

    it('should test POST /seo/audits/schedule', () => {
      testAPI('POST', '/seo/audits/schedule', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/audits/schedule',
      });
    });

    it('should test POST /seo/competitors', () => {
      testAPI('POST', '/seo/competitors', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/competitors',
      });
    });

    it('should test POST /seo/competitors/${id}/analyze', () => {
      testAPI('POST', '/seo/competitors/test-id/analyze', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/competitors/${id}/analyze',
      });
    });

    it('should test POST /seo/keywords', () => {
      testAPI('POST', '/seo/keywords', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/keywords',
      });
    });

    it('should test POST /seo/keywords/refresh-positions', () => {
      testAPI('POST', '/seo/keywords/refresh-positions', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/keywords/refresh-positions',
      });
    });

    it('should test POST /seo/meta-tags', () => {
      testAPI('POST', '/seo/meta-tags', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/meta-tags',
      });
    });

    it('should test POST /seo/redirects', () => {
      testAPI('POST', '/seo/redirects', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/redirects',
      });
    });

    it('should test POST /seo/reports/generate', () => {
      testAPI('POST', '/seo/reports/generate', 401, 'Seo', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /seo/reports/generate',
      });
    });

    it('should test POST /seo/schema-markup', () => {
      testAPI('POST', '/seo/schema-markup', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/schema-markup',
      });
    });

    it('should test POST /seo/schema-markup/validate', () => {
      testAPI('POST', '/seo/schema-markup/validate', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/schema-markup/validate',
      });
    });

    it('should test POST /seo/sitemap/entries', () => {
      testAPI('POST', '/seo/sitemap/entries', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/sitemap/entries',
      });
    });

    it('should test POST /seo/sitemap/generate', () => {
      testAPI('POST', '/seo/sitemap/generate', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/sitemap/generate',
      });
    });

    it('should test POST /seo/templates', () => {
      testAPI('POST', '/seo/templates', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/templates',
      });
    });

    it('should test POST /seo/templates/${templateId}/apply', () => {
      testAPI('POST', '/seo/templates/test-id/apply', 401, 'Seo', {
        requiresAuth: false,
        description: 'POST /seo/templates/${templateId}/apply',
      });
    });

  });

  describe('PUT Requests (1 endpoints)', () => {
    it('should test PUT /seo/robots.txt', () => {
      testAPI('PUT', '/seo/robots.txt', 401, 'Seo', {
        requiresAuth: false,
        description: 'PUT /seo/robots.txt',
      });
    });

  });

  describe('PATCH Requests (7 endpoints)', () => {
    it('should test PATCH /seo/keywords/${id}', () => {
      testAPI('PATCH', '/seo/keywords/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'PATCH /seo/keywords/${id}',
      });
    });

    it('should test PATCH /seo/meta-tags/${id}', () => {
      testAPI('PATCH', '/seo/meta-tags/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'PATCH /seo/meta-tags/${id}',
      });
    });

    it('should test PATCH /seo/meta-tags/bulk', () => {
      testAPI('PATCH', '/seo/meta-tags/bulk', 401, 'Seo', {
        requiresAuth: false,
        description: 'PATCH /seo/meta-tags/bulk',
      });
    });

    it('should test PATCH /seo/schema-markup/${id}', () => {
      testAPI('PATCH', '/seo/schema-markup/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'PATCH /seo/schema-markup/${id}',
      });
    });

    it('should test PATCH /seo/settings', () => {
      testAPI('PATCH', '/seo/settings', 401, 'Seo', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PATCH /seo/settings',
      });
    });

    it('should test PATCH /seo/sitemap/entries/${id}', () => {
      testAPI('PATCH', '/seo/sitemap/entries/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'PATCH /seo/sitemap/entries/${id}',
      });
    });

    it('should test PATCH /seo/templates/${id}', () => {
      testAPI('PATCH', '/seo/templates/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'PATCH /seo/templates/${id}',
      });
    });

  });

  describe('DELETE Requests (7 endpoints)', () => {
    it('should test DELETE /seo/competitors/${id}', () => {
      testAPI('DELETE', '/seo/competitors/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'DELETE /seo/competitors/${id}',
      });
    });

    it('should test DELETE /seo/keywords/${id}', () => {
      testAPI('DELETE', '/seo/keywords/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'DELETE /seo/keywords/${id}',
      });
    });

    it('should test DELETE /seo/meta-tags/${id}', () => {
      testAPI('DELETE', '/seo/meta-tags/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'DELETE /seo/meta-tags/${id}',
      });
    });

    it('should test DELETE /seo/redirects/${id}', () => {
      testAPI('DELETE', '/seo/redirects/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'DELETE /seo/redirects/${id}',
      });
    });

    it('should test DELETE /seo/schema-markup/${id}', () => {
      testAPI('DELETE', '/seo/schema-markup/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'DELETE /seo/schema-markup/${id}',
      });
    });

    it('should test DELETE /seo/sitemap/entries/${id}', () => {
      testAPI('DELETE', '/seo/sitemap/entries/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'DELETE /seo/sitemap/entries/${id}',
      });
    });

    it('should test DELETE /seo/templates/${id}', () => {
      testAPI('DELETE', '/seo/templates/test-id', 401, 'Seo', {
        requiresAuth: false,
        description: 'DELETE /seo/templates/${id}',
      });
    });

  });

});
