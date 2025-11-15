/**
 * FIXED API Tests for Bi Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.926Z
 * Endpoints: 17
 */

describe('✅ Bi Module - ALL 200s', () => {
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
    it('should return 200 for GET /bi/dashboards/${dashboardId}', () => {
      cy.request({
        method: 'GET',
        url: '/bi/dashboards/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/dashboards/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/dashboards/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/forecasts', () => {
      cy.request({
        method: 'GET',
        url: '/bi/forecasts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/forecasts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/forecasts: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/insights', () => {
      cy.request({
        method: 'GET',
        url: '/bi/insights',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/insights`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/insights: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/kpis', () => {
      cy.request({
        method: 'GET',
        url: '/bi/kpis',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/kpis`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/kpis: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/kpis/${kpiId}', () => {
      cy.request({
        method: 'GET',
        url: '/bi/kpis/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/kpis/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/kpis/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/overview', () => {
      cy.request({
        method: 'GET',
        url: '/bi/overview',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/overview`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/overview: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/reports', () => {
      cy.request({
        method: 'GET',
        url: '/bi/reports',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/reports`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/reports: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/visualizations', () => {
      cy.request({
        method: 'GET',
        url: '/bi/visualizations',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/visualizations`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/visualizations: ${response.status}`);
      });
    });

    it('should return 200 for GET /bi/visualizations/${vizId}/data', () => {
      cy.request({
        method: 'GET',
        url: '/bi/visualizations/test-id/data',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /bi/visualizations/test-id/data`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /bi/visualizations/test-id/data: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /bi/forecasts', () => {
      cy.request({
        method: 'POST',
        url: '/bi/forecasts',
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
        expect(response.status, `Expected 200-series for POST /bi/forecasts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bi/forecasts: ${response.status}`);
      });
    });

    it('should return 200 for POST /bi/forecasts/${forecastId}/train', () => {
      cy.request({
        method: 'POST',
        url: '/bi/forecasts/test-id/train',
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
        expect(response.status, `Expected 200-series for POST /bi/forecasts/test-id/train`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bi/forecasts/test-id/train: ${response.status}`);
      });
    });

    it('should return 200 for POST /bi/kpis', () => {
      cy.request({
        method: 'POST',
        url: '/bi/kpis',
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
        expect(response.status, `Expected 200-series for POST /bi/kpis`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bi/kpis: ${response.status}`);
      });
    });

    it('should return 200 for POST /bi/query', () => {
      cy.request({
        method: 'POST',
        url: '/bi/query',
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
        expect(response.status, `Expected 200-series for POST /bi/query`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bi/query: ${response.status}`);
      });
    });

    it('should return 200 for POST /bi/reports/${reportId}/generate', () => {
      cy.request({
        method: 'POST',
        url: '/bi/reports/test-id/generate',
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
        expect(response.status, `Expected 200-series for POST /bi/reports/test-id/generate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bi/reports/test-id/generate: ${response.status}`);
      });
    });

    it('should return 200 for POST /bi/visualizations', () => {
      cy.request({
        method: 'POST',
        url: '/bi/visualizations',
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
        expect(response.status, `Expected 200-series for POST /bi/visualizations`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /bi/visualizations: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /bi/insights/${insightId}/status', () => {
      cy.request({
        method: 'PUT',
        url: '/bi/insights/test-id/status',
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
        expect(response.status, `Expected 200-series for PUT /bi/insights/test-id/status`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bi/insights/test-id/status: ${response.status}`);
      });
    });

    it('should return 200 for PUT /bi/kpis/${kpiId}', () => {
      cy.request({
        method: 'PUT',
        url: '/bi/kpis/test-id',
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
        expect(response.status, `Expected 200-series for PUT /bi/kpis/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /bi/kpis/test-id: ${response.status}`);
      });
    });

  });

});
