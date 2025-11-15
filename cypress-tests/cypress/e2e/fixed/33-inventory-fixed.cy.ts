/**
 * FIXED API Tests for Inventory Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.941Z
 * Endpoints: 39
 */

describe('✅ Inventory Module - ALL 200s', () => {
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
    it('should return 200 for GET /inventory/alert-rules', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alert-rules',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alert-rules`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alert-rules: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alert-rules/${id}', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alert-rules/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alert-rules/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alert-rules/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/${id}', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/export', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/export',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/export: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/optimization-suggestions', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/optimization-suggestions',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/optimization-suggestions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/optimization-suggestions: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/realtime', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/realtime',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/realtime`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/realtime: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/settings', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/settings',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/settings: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/stats', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/stats',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/stats`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/stats: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/threshold-suggestions/${productId}', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/threshold-suggestions/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/threshold-suggestions/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/threshold-suggestions/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/top-products', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/top-products',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/top-products`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/top-products: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/alerts/trends', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/alerts/trends',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/alerts/trends`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/alerts/trends: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/notification-channels', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/notification-channels',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/notification-channels`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/notification-channels: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/thresholds', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/thresholds',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/thresholds`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/thresholds: ${response.status}`);
      });
    });

    it('should return 200 for GET /inventory/thresholds/${productId}', () => {
      cy.request({
        method: 'GET',
        url: '/inventory/thresholds/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /inventory/thresholds/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /inventory/thresholds/test-id: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /inventory/alert-rules', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alert-rules',
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
        expect(response.status, `Expected 200-series for POST /inventory/alert-rules`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alert-rules: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alert-rules/${id}/test', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alert-rules/test-id/test',
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
        expect(response.status, `Expected 200-series for POST /inventory/alert-rules/test-id/test`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alert-rules/test-id/test: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alert-rules/${id}/toggle', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alert-rules/test-id/toggle',
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
        expect(response.status, `Expected 200-series for POST /inventory/alert-rules/test-id/toggle`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alert-rules/test-id/toggle: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/${id}/acknowledge', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/test-id/acknowledge',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/test-id/acknowledge`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/test-id/acknowledge: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/${id}/dismiss', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/test-id/dismiss',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/test-id/dismiss`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/test-id/dismiss: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/${id}/resolve', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/test-id/resolve',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/test-id/resolve`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/test-id/resolve: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/bulk-acknowledge', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/bulk-acknowledge',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/bulk-acknowledge`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/bulk-acknowledge: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/bulk-action', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/bulk-action',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/bulk-action`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/bulk-action: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/bulk-resolve', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/bulk-resolve',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/bulk-resolve`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/bulk-resolve: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/check-now', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/check-now',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/check-now`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/check-now: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/alerts/reports', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/alerts/reports',
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
        expect(response.status, `Expected 200-series for POST /inventory/alerts/reports`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/alerts/reports: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/notification-channels', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/notification-channels',
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
        expect(response.status, `Expected 200-series for POST /inventory/notification-channels`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/notification-channels: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/notification-channels/${id}/set-default', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/notification-channels/test-id/set-default',
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
        expect(response.status, `Expected 200-series for POST /inventory/notification-channels/test-id/set-default`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/notification-channels/test-id/set-default: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/notification-channels/${id}/test', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/notification-channels/test-id/test',
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
        expect(response.status, `Expected 200-series for POST /inventory/notification-channels/test-id/test`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/notification-channels/test-id/test: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/thresholds', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/thresholds',
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
        expect(response.status, `Expected 200-series for POST /inventory/thresholds`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/thresholds: ${response.status}`);
      });
    });

    it('should return 200 for POST /inventory/thresholds/bulk-update', () => {
      cy.request({
        method: 'POST',
        url: '/inventory/thresholds/bulk-update',
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
        expect(response.status, `Expected 200-series for POST /inventory/thresholds/bulk-update`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /inventory/thresholds/bulk-update: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /inventory/alert-rules/${id}', () => {
      cy.request({
        method: 'PUT',
        url: '/inventory/alert-rules/test-id',
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
        expect(response.status, `Expected 200-series for PUT /inventory/alert-rules/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /inventory/alert-rules/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /inventory/alerts/${id}/severity', () => {
      cy.request({
        method: 'PUT',
        url: '/inventory/alerts/test-id/severity',
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
        expect(response.status, `Expected 200-series for PUT /inventory/alerts/test-id/severity`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /inventory/alerts/test-id/severity: ${response.status}`);
      });
    });

    it('should return 200 for PUT /inventory/alerts/settings', () => {
      cy.request({
        method: 'PUT',
        url: '/inventory/alerts/settings',
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
        expect(response.status, `Expected 200-series for PUT /inventory/alerts/settings`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /inventory/alerts/settings: ${response.status}`);
      });
    });

    it('should return 200 for PUT /inventory/notification-channels/${id}', () => {
      cy.request({
        method: 'PUT',
        url: '/inventory/notification-channels/test-id',
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
        expect(response.status, `Expected 200-series for PUT /inventory/notification-channels/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /inventory/notification-channels/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /inventory/thresholds/${productId}', () => {
      cy.request({
        method: 'PUT',
        url: '/inventory/thresholds/test-id',
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
        expect(response.status, `Expected 200-series for PUT /inventory/thresholds/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /inventory/thresholds/test-id: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /inventory/alert-rules/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/inventory/alert-rules/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /inventory/alert-rules/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /inventory/alert-rules/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /inventory/notification-channels/${id}', () => {
      cy.request({
        method: 'DELETE',
        url: '/inventory/notification-channels/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /inventory/notification-channels/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /inventory/notification-channels/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /inventory/thresholds/${productId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/inventory/thresholds/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /inventory/thresholds/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /inventory/thresholds/test-id: ${response.status}`);
      });
    });

  });

});
