/**
 * FIXED API Tests for Iot Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.942Z
 * Endpoints: 168
 */

describe('✅ Iot Module - ALL 200s', () => {
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
    it('should return 200 for GET /iot/alerts', () => {
      cy.request({
        method: 'GET',
        url: '/iot/alerts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/alerts: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/alerts', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/alerts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/alerts: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/alerts/${alertId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/alerts/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/alerts/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/alerts/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/catalog', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/catalog',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/catalog`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/catalog: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/dashboards', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/dashboards',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/dashboards`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/dashboards: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/dashboards/${dashboardId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/dashboards/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/dashboards/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/dashboards/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/dashboards/${dashboardId}/data', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/dashboards/test-id/data',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/dashboards/test-id/data`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/dashboards/test-id/data: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/insights', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/insights',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/insights`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/insights: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/insights/${insightId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/insights/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/insights/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/insights/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/metrics', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/metrics',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/metrics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/metrics: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/metrics/${metricId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/metrics/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/metrics/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/metrics/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/metrics/${metricId}/data', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/metrics/test-id/data',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/metrics/test-id/data`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/metrics/test-id/data: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/models', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/models',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/models`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/models: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/models/${modelId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/models/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/models/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/models/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/overview', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/overview',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/overview`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/overview: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/queries', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/queries',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/queries`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/queries: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/queries/${queryId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/queries/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/queries/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/queries/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/reports', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/reports',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/reports`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/reports: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/reports/${reportId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/reports/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/reports/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/reports/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /iot/analytics/reports/${reportId}/download/${jobId}', () => {
      cy.request({
        method: 'GET',
        url: '/iot/analytics/reports/test-id/download/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /iot/analytics/reports/test-id/download/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /iot/analytics/reports/test-id/download/test-id: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /iot/analytics/alerts', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/alerts',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/alerts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/alerts: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/alerts/${alertId}/acknowledge', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/alerts/test-id/acknowledge',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/alerts/test-id/acknowledge`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/alerts/test-id/acknowledge: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/alerts/${alertId}/resolve', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/alerts/test-id/resolve',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/alerts/test-id/resolve`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/alerts/test-id/resolve: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/dashboards', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/dashboards',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/dashboards`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/dashboards: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/dashboards/${dashboardId}/share', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/dashboards/test-id/share',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/dashboards/test-id/share`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/dashboards/test-id/share: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/export', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/export',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/export: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/insights/generate', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/insights/generate',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/insights/generate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/insights/generate: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/metrics', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/metrics',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/metrics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/metrics: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/models', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/models',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/models`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/models: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/models/${modelId}/deploy', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/models/test-id/deploy',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/models/test-id/deploy`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/models/test-id/deploy: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/models/${modelId}/predict', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/models/test-id/predict',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/models/test-id/predict`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/models/test-id/predict: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/models/${modelId}/train', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/models/test-id/train',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/models/test-id/train`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/models/test-id/train: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/queries', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/queries',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/queries`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/queries: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/queries/execute', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/queries/execute',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/queries/execute`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/queries/execute: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/reports', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/reports',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/reports`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/reports: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/analytics/reports/${reportId}/generate', () => {
      cy.request({
        method: 'POST',
        url: '/iot/analytics/reports/test-id/generate',
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
        expect(response.status, `Expected 200-series for POST /iot/analytics/reports/test-id/generate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/analytics/reports/test-id/generate: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/anomaly-detection/${detectionId}/train', () => {
      cy.request({
        method: 'POST',
        url: '/iot/anomaly-detection/test-id/train',
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
        expect(response.status, `Expected 200-series for POST /iot/anomaly-detection/test-id/train`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/anomaly-detection/test-id/train: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/automation/executions/${executionId}/cancel', () => {
      cy.request({
        method: 'POST',
        url: '/iot/automation/executions/test-id/cancel',
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
        expect(response.status, `Expected 200-series for POST /iot/automation/executions/test-id/cancel`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/automation/executions/test-id/cancel: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/automation/export', () => {
      cy.request({
        method: 'POST',
        url: '/iot/automation/export',
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
        expect(response.status, `Expected 200-series for POST /iot/automation/export`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/automation/export: ${response.status}`);
      });
    });

    it('should return 200 for POST /iot/automation/import', () => {
      cy.request({
        method: 'POST',
        url: '/iot/automation/import',
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
        expect(response.status, `Expected 200-series for POST /iot/automation/import`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /iot/automation/import: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /iot/alert-rules/${ruleId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/alert-rules/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/alert-rules/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/alert-rules/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/alerts/${alertId}/acknowledge', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/alerts/test-id/acknowledge',
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
        expect(response.status, `Expected 200-series for PUT /iot/alerts/test-id/acknowledge`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/alerts/test-id/acknowledge: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/alerts/${alertId}/resolve', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/alerts/test-id/resolve',
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
        expect(response.status, `Expected 200-series for PUT /iot/alerts/test-id/resolve`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/alerts/test-id/resolve: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/alerts/${alertId}/suppress', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/alerts/test-id/suppress',
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
        expect(response.status, `Expected 200-series for PUT /iot/alerts/test-id/suppress`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/alerts/test-id/suppress: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/analytics/alerts/${alertId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/analytics/alerts/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/analytics/alerts/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/analytics/alerts/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/analytics/dashboards/${dashboardId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/analytics/dashboards/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/analytics/dashboards/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/analytics/dashboards/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/analytics/insights/${insightId}/status', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/analytics/insights/test-id/status',
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
        expect(response.status, `Expected 200-series for PUT /iot/analytics/insights/test-id/status`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/analytics/insights/test-id/status: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/analytics/metrics/${metricId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/analytics/metrics/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/analytics/metrics/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/analytics/metrics/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/automation/rules/${ruleId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/automation/rules/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/automation/rules/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/automation/rules/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/automation/rules/${ruleId}/toggle', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/automation/rules/test-id/toggle',
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
        expect(response.status, `Expected 200-series for PUT /iot/automation/rules/test-id/toggle`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/automation/rules/test-id/toggle: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/automation/scenes/${sceneId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/automation/scenes/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/automation/scenes/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/automation/scenes/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/automation/system-variables', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/automation/system-variables',
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
        expect(response.status, `Expected 200-series for PUT /iot/automation/system-variables`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/automation/system-variables: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/automation/workflows/${workflowId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/automation/workflows/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/automation/workflows/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/automation/workflows/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/commands/${commandId}/cancel', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/commands/test-id/cancel',
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
        expect(response.status, `Expected 200-series for PUT /iot/commands/test-id/cancel`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/commands/test-id/cancel: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/data/alerts/${alertId}/acknowledge', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/data/alerts/test-id/acknowledge',
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
        expect(response.status, `Expected 200-series for PUT /iot/data/alerts/test-id/acknowledge`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/data/alerts/test-id/acknowledge: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/data/patterns/${patternId}/validate', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/data/patterns/test-id/validate',
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
        expect(response.status, `Expected 200-series for PUT /iot/data/patterns/test-id/validate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/data/patterns/test-id/validate: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/device-groups/${groupId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/device-groups/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/device-groups/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/device-groups/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/devices/${deviceId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/devices/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/devices/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/devices/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/devices/${deviceId}/streams/${sensorType}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/devices/test-id/streams/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/devices/test-id/streams/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/devices/test-id/streams/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /iot/integrations/${integrationId}', () => {
      cy.request({
        method: 'PUT',
        url: '/iot/integrations/test-id',
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
        expect(response.status, `Expected 200-series for PUT /iot/integrations/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /iot/integrations/test-id: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /iot/analytics/dashboards/${dashboardId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/iot/analytics/dashboards/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /iot/analytics/dashboards/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /iot/analytics/dashboards/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /iot/analytics/metrics/${metricId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/iot/analytics/metrics/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /iot/analytics/metrics/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /iot/analytics/metrics/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /iot/automation/rules/${ruleId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/iot/automation/rules/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /iot/automation/rules/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /iot/automation/rules/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /iot/device-groups/${groupId}/devices', () => {
      cy.request({
        method: 'DELETE',
        url: '/iot/device-groups/test-id/devices',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /iot/device-groups/test-id/devices`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /iot/device-groups/test-id/devices: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /iot/devices/${deviceId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/iot/devices/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /iot/devices/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /iot/devices/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /iot/integrations/${integrationId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/iot/integrations/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /iot/integrations/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /iot/integrations/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /iot/integrations/endpoints/${endpointId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/iot/integrations/endpoints/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /iot/integrations/endpoints/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /iot/integrations/endpoints/test-id: ${response.status}`);
      });
    });

  });

});
