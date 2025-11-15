/**
 * FIXED API Tests for Seo Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.962Z
 * Endpoints: 48
 */

describe('✅ Seo Module - ALL 200s', () => {
  let authToken: string;

  before(() => {
    // AUTHENTICATE BEFORE ALL TESTS
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        authToken = response.body.data?.accessToken || 
                   response.body.data?.access_token ||
                   response.body.accessToken ||
                   response.body.token;
        cy.log(`✅ Authenticated with token`);
      } else {
        cy.log(`⚠️  Auth returned ${response.status}, continuing anyway`);
      }
    });
  });

  describe('GET Requests', () => {
    it('should return 200 for GET /seo/analytics', () => {
      cy.request({
        method: 'GET',
        url: '/seo/analytics',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/analytics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/analytics: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/analytics/top-keywords', () => {
      cy.request({
        method: 'GET',
        url: '/seo/analytics/top-keywords',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/analytics/top-keywords`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/analytics/top-keywords: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/analytics/top-pages', () => {
      cy.request({
        method: 'GET',
        url: '/seo/analytics/top-pages',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/analytics/top-pages`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/analytics/top-pages: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/audits', () => {
      cy.request({
        method: 'GET',
        url: '/seo/audits',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/audits`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/audits: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/audits/${id}', () => {
      cy.request({
        method: 'GET',
        url: '/seo/audits/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/audits/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/audits/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/competitors', () => {
      cy.request({
        method: 'GET',
        url: '/seo/competitors',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/competitors`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/competitors: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/keywords', () => {
      cy.request({
        method: 'GET',
        url: '/seo/keywords',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/keywords`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/keywords: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/keywords/suggestions', () => {
      cy.request({
        method: 'GET',
        url: '/seo/keywords/suggestions',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/keywords/suggestions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/keywords/suggestions: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/meta-tags', () => {
      cy.request({
        method: 'GET',
        url: '/seo/meta-tags',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/meta-tags`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/meta-tags: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/meta-tags/${id}', () => {
      cy.request({
        method: 'GET',
        url: '/seo/meta-tags/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/meta-tags/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/meta-tags/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/meta-tags/by-url', () => {
      cy.request({
        method: 'GET',
        url: '/seo/meta-tags/by-url',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/meta-tags/by-url`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/meta-tags/by-url: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/redirects', () => {
      cy.request({
        method: 'GET',
        url: '/seo/redirects',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/redirects`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/redirects: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/robots.txt', () => {
      cy.request({
        method: 'GET',
        url: '/seo/robots.txt',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/robots.txt`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/robots.txt: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/schema-markup', () => {
      cy.request({
        method: 'GET',
        url: '/seo/schema-markup',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/schema-markup`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/schema-markup: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/settings', () => {
      cy.request({
        method: 'GET',
        url: '/seo/settings',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/settings: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/sitemap.xml', () => {
      cy.request({
        method: 'GET',
        url: '/seo/sitemap.xml',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/sitemap.xml`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/sitemap.xml: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/sitemap/entries', () => {
      cy.request({
        method: 'GET',
        url: '/seo/sitemap/entries',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/sitemap/entries`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/sitemap/entries: ${response.status}`);
      });
    });

    it('should return 200 for GET /seo/templates', () => {
      cy.request({
        method: 'GET',
        url: '/seo/templates',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /seo/templates`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /seo/templates: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /seo/audits', () => {
      cy.request({
        method: 'POST',
        url: '/seo/audits',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/audits`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/audits: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/audits/schedule', () => {
      cy.request({
        method: 'POST',
        url: '/seo/audits/schedule',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/audits/schedule`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/audits/schedule: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/competitors', () => {
      cy.request({
        method: 'POST',
        url: '/seo/competitors',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/competitors`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/competitors: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/competitors/${id}/analyze', () => {
      cy.request({
        method: 'POST',
        url: '/seo/competitors/test-id/analyze',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/competitors/test-id/analyze`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/competitors/test-id/analyze: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/keywords', () => {
      cy.request({
        method: 'POST',
        url: '/seo/keywords',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/keywords`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/keywords: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/keywords/refresh-positions', () => {
      cy.request({
        method: 'POST',
        url: '/seo/keywords/refresh-positions',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/keywords/refresh-positions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/keywords/refresh-positions: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/meta-tags', () => {
      cy.request({
        method: 'POST',
        url: '/seo/meta-tags',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/meta-tags`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/meta-tags: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/redirects', () => {
      cy.request({
        method: 'POST',
        url: '/seo/redirects',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/redirects`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/redirects: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/reports/generate', () => {
      cy.request({
        method: 'POST',
        url: '/seo/reports/generate',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/reports/generate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/reports/generate: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/schema-markup', () => {
      cy.request({
        method: 'POST',
        url: '/seo/schema-markup',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/schema-markup`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/schema-markup: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/schema-markup/validate', () => {
      cy.request({
        method: 'POST',
        url: '/seo/schema-markup/validate',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/schema-markup/validate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/schema-markup/validate: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/sitemap/entries', () => {
      cy.request({
        method: 'POST',
        url: '/seo/sitemap/entries',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/sitemap/entries`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/sitemap/entries: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/sitemap/generate', () => {
      cy.request({
        method: 'POST',
        url: '/seo/sitemap/generate',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/sitemap/generate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/sitemap/generate: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/templates', () => {
      cy.request({
        method: 'POST',
        url: '/seo/templates',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/templates`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/templates: ${response.status}`);
      });
    });

    it('should return 200 for POST /seo/templates/${templateId}/apply', () => {
      cy.request({
        method: 'POST',
        url: '/seo/templates/test-id/apply',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /seo/templates/test-id/apply`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /seo/templates/test-id/apply: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /seo/robots.txt', () => {
      cy.request({
        method: 'PUT',
        url: '/seo/robots.txt',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PUT /seo/robots.txt`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /seo/robots.txt: ${response.status}`);
      });
    });

  });

  describe('PATCH Requests', () => {
    it('should return 200 for PATCH /seo/keywords/${id}', () => {
      cy.request({
        method: 'PATCH',
        url: '/seo/keywords/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PATCH /seo/keywords/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /seo/keywords/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PATCH /seo/meta-tags/${id}', () => {
      cy.request({
        method: 'PATCH',
        url: '/seo/meta-tags/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PATCH /seo/meta-tags/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /seo/meta-tags/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PATCH /seo/meta-tags/bulk', () => {
      cy.request({
        method: 'PATCH',
        url: '/seo/meta-tags/bulk',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PATCH /seo/meta-tags/bulk`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /seo/meta-tags/bulk: ${response.status}`);
      });
    });

    it('should return 200 for PATCH /seo/schema-markup/${id}', () => {
      cy.request({
        method: 'PATCH',
        url: '/seo/schema-markup/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PATCH /seo/schema-markup/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /seo/schema-markup/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PATCH /seo/settings', () => {
      cy.request({
        method: 'PATCH',
        url: '/seo/settings',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PATCH /seo/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /seo/settings: ${response.status}`);
      });
    });

    it('should return 200 for PATCH /seo/sitemap/entries/${id}', () => {
      cy.request({
        method: 'PATCH',
        url: '/seo/sitemap/entries/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PATCH /seo/sitemap/entries/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /seo/sitemap/entries/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PATCH /seo/templates/${id}', () => {
      cy.request({
        method: 'PATCH',
        url: '/seo/templates/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test",
          "value": "test-value",
          "status": "active"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PATCH /seo/templates/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH /seo/templates/test-id: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /seo/competitors/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/seo/competitors/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /seo/competitors/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /seo/competitors/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /seo/keywords/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/seo/keywords/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /seo/keywords/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /seo/keywords/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /seo/meta-tags/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/seo/meta-tags/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /seo/meta-tags/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /seo/meta-tags/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /seo/redirects/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/seo/redirects/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /seo/redirects/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /seo/redirects/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /seo/schema-markup/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/seo/schema-markup/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /seo/schema-markup/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /seo/schema-markup/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /seo/sitemap/entries/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/seo/sitemap/entries/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /seo/sitemap/entries/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /seo/sitemap/entries/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /seo/templates/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/seo/templates/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /seo/templates/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /seo/templates/test-id: ${response.status}`);
      });
    });

  });

});
