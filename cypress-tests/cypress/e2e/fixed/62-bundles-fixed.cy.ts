/**
 * FIXED API Tests for Bundles Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.927Z
 * Endpoints: 39
 */

describe('✅ Bundles Module - ALL 200s', () => {
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
    it('should return 200 for GET /bundles/${bundleId}/analytics', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/test-id/analytics',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/test-id/analytics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/test-id/analytics: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/${bundleId}/availability', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/test-id/availability',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/test-id/availability`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/test-id/availability: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/${bundleId}/performance', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/test-id/performance',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/test-id/performance`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/test-id/performance: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/${bundleId}/related', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/test-id/related',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/test-id/related`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/test-id/related: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/${bundleId}/suggestions', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/test-id/suggestions',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/test-id/suggestions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/test-id/suggestions: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/${bundleId}/upsell', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/test-id/upsell',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/test-id/upsell`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/test-id/upsell: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/activity', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/activity',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/activity`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/activity: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/cross-sell/${productId}', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/cross-sell/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/cross-sell/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/cross-sell/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/export', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/export',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/export: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/promotions', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/promotions',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/promotions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/promotions: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/recommendations', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/recommendations',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/recommendations`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/recommendations: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/search', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/search',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/search`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/search: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/stats', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/stats',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/stats`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/stats: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/suggestions', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/suggestions',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/suggestions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/suggestions: ${response.status}`);
      });
    });

    it('should return 200 for GET /bundles/templates', () => {
      cy.request({
        method: 'GET',
        url: '/bundles/templates',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bundles/templates`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bundles/templates: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /bundles/${bundleId}/calculate-price', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/test-id/calculate-price',
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
        expect(response.status, `Expected 200-series for POST /bundles/test-id/calculate-price`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/test-id/calculate-price: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/${bundleId}/inventory/adjust', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/test-id/inventory/adjust',
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
        expect(response.status, `Expected 200-series for POST /bundles/test-id/inventory/adjust`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/test-id/inventory/adjust: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/${bundleId}/products', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/test-id/products',
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
        expect(response.status, `Expected 200-series for POST /bundles/test-id/products`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/test-id/products: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/bulk/activate', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/bulk/activate',
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
        expect(response.status, `Expected 200-series for POST /bundles/bulk/activate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/bulk/activate: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/bulk/archive', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/bulk/archive',
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
        expect(response.status, `Expected 200-series for POST /bundles/bulk/archive`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/bulk/archive: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/bulk/deactivate', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/bulk/deactivate',
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
        expect(response.status, `Expected 200-series for POST /bundles/bulk/deactivate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/bulk/deactivate: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/bulk/delete', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/bulk/delete',
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
        expect(response.status, `Expected 200-series for POST /bundles/bulk/delete`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/bulk/delete: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/bulk/pricing', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/bulk/pricing',
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
        expect(response.status, `Expected 200-series for POST /bundles/bulk/pricing`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/bulk/pricing: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/import', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/import',
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
        expect(response.status, `Expected 200-series for POST /bundles/import`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/import: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/promotions', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/promotions',
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
        expect(response.status, `Expected 200-series for POST /bundles/promotions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/promotions: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/promotions/${id}/activate', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/promotions/test-id/activate',
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
        expect(response.status, `Expected 200-series for POST /bundles/promotions/test-id/activate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/promotions/test-id/activate: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/promotions/${id}/deactivate', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/promotions/test-id/deactivate',
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
        expect(response.status, `Expected 200-series for POST /bundles/promotions/test-id/deactivate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/promotions/test-id/deactivate: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/templates', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/templates',
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
        expect(response.status, `Expected 200-series for POST /bundles/templates`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/templates: ${response.status}`);
      });
    });

    it('should return 200 for POST /bundles/templates/${templateId}/apply', () => {
      cy.request({
        method: 'POST',
        url: '/bundles/templates/test-id/apply',
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
        expect(response.status, `Expected 200-series for POST /bundles/templates/test-id/apply`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bundles/templates/test-id/apply: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /bundles/${bundleId}/inventory', () => {
      cy.request({
        method: 'PUT',
        url: '/bundles/test-id/inventory',
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
        expect(response.status, `Expected 200-series for PUT /bundles/test-id/inventory`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bundles/test-id/inventory: ${response.status}`);
      });
    });

    it('should return 200 for PUT /bundles/${bundleId}/pricing', () => {
      cy.request({
        method: 'PUT',
        url: '/bundles/test-id/pricing',
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
        expect(response.status, `Expected 200-series for PUT /bundles/test-id/pricing`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bundles/test-id/pricing: ${response.status}`);
      });
    });

    it('should return 200 for PUT /bundles/${bundleId}/products/${productId}', () => {
      cy.request({
        method: 'PUT',
        url: '/bundles/test-id/products/test-id',
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
        expect(response.status, `Expected 200-series for PUT /bundles/test-id/products/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bundles/test-id/products/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /bundles/${bundleId}/products/reorder', () => {
      cy.request({
        method: 'PUT',
        url: '/bundles/test-id/products/reorder',
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
        expect(response.status, `Expected 200-series for PUT /bundles/test-id/products/reorder`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bundles/test-id/products/reorder: ${response.status}`);
      });
    });

    it('should return 200 for PUT /bundles/promotions/${id}', () => {
      cy.request({
        method: 'PUT',
        url: '/bundles/promotions/test-id',
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
        expect(response.status, `Expected 200-series for PUT /bundles/promotions/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bundles/promotions/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /bundles/templates/${id}', () => {
      cy.request({
        method: 'PUT',
        url: '/bundles/templates/test-id',
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
        expect(response.status, `Expected 200-series for PUT /bundles/templates/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bundles/templates/test-id: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /bundles/${bundleId}/products/${productId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/bundles/test-id/products/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /bundles/test-id/products/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /bundles/test-id/products/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /bundles/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/bundles/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /bundles/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /bundles/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /bundles/promotions/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/bundles/promotions/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /bundles/promotions/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /bundles/promotions/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /bundles/templates/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/bundles/templates/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /bundles/templates/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /bundles/templates/test-id: ${response.status}`);
      });
    });

  });

});
