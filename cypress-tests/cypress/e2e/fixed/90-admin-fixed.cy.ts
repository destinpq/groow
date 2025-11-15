/**
 * FIXED API Tests for Admin Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.915Z
 * Endpoints: 205
 */

describe('✅ Admin Module - ALL 200s', () => {
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
    it('should return 200 for GET /admin/analytics/dashboard', () => {
      cy.request({
        method: 'GET',
        url: '/admin/analytics/dashboard',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/analytics/dashboard`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/analytics/dashboard: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/analytics/financial', () => {
      cy.request({
        method: 'GET',
        url: '/admin/analytics/financial',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/analytics/financial`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/analytics/financial: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/analytics/inventory', () => {
      cy.request({
        method: 'GET',
        url: '/admin/analytics/inventory',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/analytics/inventory`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/analytics/inventory: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/analytics/revenue', () => {
      cy.request({
        method: 'GET',
        url: '/admin/analytics/revenue',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/analytics/revenue`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/analytics/revenue: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/analytics/traffic', () => {
      cy.request({
        method: 'GET',
        url: '/admin/analytics/traffic',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/analytics/traffic`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/analytics/traffic: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/banners', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/banners',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/banners`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/banners: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/banners/${bannerId}', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/banners/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/banners/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/banners/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/banners/${bannerId}/analytics', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/banners/test-id/analytics',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/banners/test-id/analytics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/banners/test-id/analytics: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/media', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/media',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/media`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/media: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/media/folders', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/media/folders',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/media/folders`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/media/folders: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/menus', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/menus',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/menus`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/menus: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/menus/${menuId}', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/menus/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/menus/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/menus/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/pages', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/pages',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/pages`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/pages: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/pages/${pageId}', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/pages/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/pages/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/pages/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/settings', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/settings',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/settings: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/templates', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/templates',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/templates`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/templates: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/cms/testimonials', () => {
      cy.request({
        method: 'GET',
        url: '/admin/cms/testimonials',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/cms/testimonials`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/cms/testimonials: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/dashboard/alerts', () => {
      cy.request({
        method: 'GET',
        url: '/admin/dashboard/alerts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/dashboard/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/dashboard/alerts: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/dashboard/conversion', () => {
      cy.request({
        method: 'GET',
        url: '/admin/dashboard/conversion',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/dashboard/conversion`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/dashboard/conversion: ${response.status}`);
      });
    });

    it('should return 200 for GET /admin/dashboard/export', () => {
      cy.request({
        method: 'GET',
        url: '/admin/dashboard/export',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /admin/dashboard/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /admin/dashboard/export: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST ${this.baseURL}/admin/impersonate', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/admin/impersonate',
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
        expect(response.status, `Expected 200-series for POST test-id/admin/impersonate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/admin/impersonate: ${response.status}`);
      });
    });

    it('should return 200 for POST ${this.baseURL}/admin/stop-impersonation', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/admin/stop-impersonation',
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
        expect(response.status, `Expected 200-series for POST test-id/admin/stop-impersonation`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/admin/stop-impersonation: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/analytics/comparative', () => {
      cy.request({
        method: 'POST',
        url: '/admin/analytics/comparative',
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
        expect(response.status, `Expected 200-series for POST /admin/analytics/comparative`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/analytics/comparative: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/analytics/conversion', () => {
      cy.request({
        method: 'POST',
        url: '/admin/analytics/conversion',
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
        expect(response.status, `Expected 200-series for POST /admin/analytics/conversion`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/analytics/conversion: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/analytics/customer-behavior', () => {
      cy.request({
        method: 'POST',
        url: '/admin/analytics/customer-behavior',
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
        expect(response.status, `Expected 200-series for POST /admin/analytics/customer-behavior`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/analytics/customer-behavior: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/analytics/vendor-performance', () => {
      cy.request({
        method: 'POST',
        url: '/admin/analytics/vendor-performance',
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
        expect(response.status, `Expected 200-series for POST /admin/analytics/vendor-performance`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/analytics/vendor-performance: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/banners', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/banners',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/banners`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/banners: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/cache/clear', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/cache/clear',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/cache/clear`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/cache/clear: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/media/folders', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/media/folders',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/media/folders`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/media/folders: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/media/upload', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/media/upload',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/media/upload`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/media/upload: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/menus', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/menus',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/menus`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/menus: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/pages', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/pages',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/pages`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/pages: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/pages/${pageId}/duplicate', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/pages/test-id/duplicate',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/pages/test-id/duplicate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/pages/test-id/duplicate: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/pages/${pageId}/publish', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/pages/test-id/publish',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/pages/test-id/publish`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/pages/test-id/publish: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/testimonials', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/testimonials',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/testimonials`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/testimonials: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/testimonials/${testimonialId}/approve', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/testimonials/test-id/approve',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/testimonials/test-id/approve`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/testimonials/test-id/approve: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/cms/testimonials/${testimonialId}/reject', () => {
      cy.request({
        method: 'POST',
        url: '/admin/cms/testimonials/test-id/reject',
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
        expect(response.status, `Expected 200-series for POST /admin/cms/testimonials/test-id/reject`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/cms/testimonials/test-id/reject: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/finance/export', () => {
      cy.request({
        method: 'POST',
        url: '/admin/finance/export',
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
        expect(response.status, `Expected 200-series for POST /admin/finance/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/finance/export: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/finance/gateways/${gatewayId}/test', () => {
      cy.request({
        method: 'POST',
        url: '/admin/finance/gateways/test-id/test',
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
        expect(response.status, `Expected 200-series for POST /admin/finance/gateways/test-id/test`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/finance/gateways/test-id/test: ${response.status}`);
      });
    });

    it('should return 200 for POST /admin/finance/payouts', () => {
      cy.request({
        method: 'POST',
        url: '/admin/finance/payouts',
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
        expect(response.status, `Expected 200-series for POST /admin/finance/payouts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /admin/finance/payouts: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /admin/cms/banners/${bannerId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/cms/banners/test-id',
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
        expect(response.status, `Expected 200-series for PUT /admin/cms/banners/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/cms/banners/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/cms/media/${fileId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/cms/media/test-id',
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
        expect(response.status, `Expected 200-series for PUT /admin/cms/media/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/cms/media/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/cms/menus/${menuId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/cms/menus/test-id',
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
        expect(response.status, `Expected 200-series for PUT /admin/cms/menus/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/cms/menus/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/cms/menus/${menuId}/reorder', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/cms/menus/test-id/reorder',
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
        expect(response.status, `Expected 200-series for PUT /admin/cms/menus/test-id/reorder`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/cms/menus/test-id/reorder: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/cms/pages/${pageId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/cms/pages/test-id',
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
        expect(response.status, `Expected 200-series for PUT /admin/cms/pages/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/cms/pages/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/cms/settings', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/cms/settings',
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
        expect(response.status, `Expected 200-series for PUT /admin/cms/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/cms/settings: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/cms/testimonials/${testimonialId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/cms/testimonials/test-id',
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
        expect(response.status, `Expected 200-series for PUT /admin/cms/testimonials/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/cms/testimonials/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/dashboard/alerts/${alertId}/acknowledge', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/dashboard/alerts/test-id/acknowledge',
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
        expect(response.status, `Expected 200-series for PUT /admin/dashboard/alerts/test-id/acknowledge`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/dashboard/alerts/test-id/acknowledge: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/dashboard/preferences', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/dashboard/preferences',
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
        expect(response.status, `Expected 200-series for PUT /admin/dashboard/preferences`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/dashboard/preferences: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/finance/gateways/${gatewayId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/finance/gateways/test-id',
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
        expect(response.status, `Expected 200-series for PUT /admin/finance/gateways/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/finance/gateways/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/finance/settings', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/finance/settings',
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
        expect(response.status, `Expected 200-series for PUT /admin/finance/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/finance/settings: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/inventory/${itemId}/stock', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/inventory/test-id/stock',
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
        expect(response.status, `Expected 200-series for PUT /admin/inventory/test-id/stock`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/inventory/test-id/stock: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/inventory/${productId}/reorder-level', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/inventory/test-id/reorder-level',
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
        expect(response.status, `Expected 200-series for PUT /admin/inventory/test-id/reorder-level`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/inventory/test-id/reorder-level: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/inventory/settings', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/inventory/settings',
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
        expect(response.status, `Expected 200-series for PUT /admin/inventory/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/inventory/settings: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/orders/${orderId}/shipping-address', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/orders/test-id/shipping-address',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "items": [
                    {
                              "productId": "test-id",
                              "quantity": 1
                    }
          ],
          "shippingAddress": "Test Address"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PUT /admin/orders/test-id/shipping-address`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/orders/test-id/shipping-address: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/orders/${orderId}/status', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/orders/test-id/status',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "items": [
                    {
                              "productId": "test-id",
                              "quantity": 1
                    }
          ],
          "shippingAddress": "Test Address"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PUT /admin/orders/test-id/status`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/orders/test-id/status: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/products/${productId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/products/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test Product",
          "price": 99.99,
          "description": "Test description",
          "stock": 100
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PUT /admin/products/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/products/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/products/${productId}/variations/${variationId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/products/test-id/variations/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test Product",
          "price": 99.99,
          "description": "Test description",
          "stock": 100
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PUT /admin/products/test-id/variations/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/products/test-id/variations/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/products/attributes/${attributeId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/products/attributes/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test Product",
          "price": 99.99,
          "description": "Test description",
          "stock": 100
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PUT /admin/products/attributes/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/products/attributes/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /admin/products/categories/${categoryId}', () => {
      cy.request({
        method: 'PUT',
        url: '/admin/products/categories/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "name": "Test Product",
          "price": 99.99,
          "description": "Test description",
          "stock": 100
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for PUT /admin/products/categories/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /admin/products/categories/test-id: ${response.status}`);
      });
    });

  });

  describe('PATCH Requests', () => {
    it('should return 200 for PATCH ${this.baseURL}/admin/users/${userId}/status', () => {
      cy.request({
        method: 'PATCH',
        url: 'test-id/admin/users/test-id/status',
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
        expect(response.status, `Expected 200-series for PATCH test-id/admin/users/test-id/status`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PATCH test-id/admin/users/test-id/status: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE ${this.baseURL}/admin/users/${userId}', () => {
      cy.request({
        method: 'DELETE',
        url: 'test-id/admin/users/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE test-id/admin/users/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE test-id/admin/users/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/cms/banners/${bannerId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/cms/banners/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/cms/banners/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/cms/banners/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/cms/media/${fileId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/cms/media/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/cms/media/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/cms/media/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/cms/menus/${menuId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/cms/menus/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/cms/menus/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/cms/menus/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/cms/pages/${pageId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/cms/pages/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/cms/pages/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/cms/pages/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/cms/testimonials/${testimonialId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/cms/testimonials/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/cms/testimonials/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/cms/testimonials/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/dashboard/alerts/${alertId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/dashboard/alerts/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/dashboard/alerts/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/dashboard/alerts/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/orders/${orderId}/tags', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/orders/test-id/tags',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/orders/test-id/tags`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/orders/test-id/tags: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/products/${productId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/products/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/products/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/products/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/products/${productId}/variations/${variationId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/products/test-id/variations/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/products/test-id/variations/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/products/test-id/variations/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/products/attributes/${attributeId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/products/attributes/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/products/attributes/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/products/attributes/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/products/categories/${categoryId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/products/categories/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/products/categories/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/products/categories/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/reports/custom/${reportId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/reports/custom/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/reports/custom/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/reports/custom/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/reports/scheduled/${scheduleId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/reports/scheduled/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/reports/scheduled/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/reports/scheduled/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/users/${userId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/users/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/users/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/users/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /admin/users/${userId}/sessions/${sessionId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/admin/users/test-id/sessions/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /admin/users/test-id/sessions/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /admin/users/test-id/sessions/test-id: ${response.status}`);
      });
    });

  });

});
