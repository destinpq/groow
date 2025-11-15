/**
 * FIXED API Tests for Payment Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.952Z
 * Endpoints: 10
 */

describe('✅ Payment Module - ALL 200s', () => {
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
    it('should return 200 for GET /payment/${paymentId}/status', () => {
      cy.request({
        method: 'GET',
        url: '/payment/test-id/status',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /payment/test-id/status`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /payment/test-id/status: ${response.status}`);
      });
    });

    it('should return 200 for GET /payment/methods', () => {
      cy.request({
        method: 'GET',
        url: '/payment/methods',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /payment/methods`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /payment/methods: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /payment/${paymentId}/refund', () => {
      cy.request({
        method: 'POST',
        url: '/payment/test-id/refund',
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
        expect(response.status, `Expected 200-series for POST /payment/test-id/refund`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /payment/test-id/refund: ${response.status}`);
      });
    });

    it('should return 200 for POST /payment/confirm', () => {
      cy.request({
        method: 'POST',
        url: '/payment/confirm',
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
        expect(response.status, `Expected 200-series for POST /payment/confirm`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /payment/confirm: ${response.status}`);
      });
    });

    it('should return 200 for POST /payment/create-intent', () => {
      cy.request({
        method: 'POST',
        url: '/payment/create-intent',
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
        expect(response.status, `Expected 200-series for POST /payment/create-intent`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /payment/create-intent: ${response.status}`);
      });
    });

    it('should return 200 for POST /payment/methods', () => {
      cy.request({
        method: 'POST',
        url: '/payment/methods',
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
        expect(response.status, `Expected 200-series for POST /payment/methods`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /payment/methods: ${response.status}`);
      });
    });

    it('should return 200 for POST /payment/process', () => {
      cy.request({
        method: 'POST',
        url: '/payment/process',
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
        expect(response.status, `Expected 200-series for POST /payment/process`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /payment/process: ${response.status}`);
      });
    });

    it('should return 200 for POST /payment/webhook/${provider}', () => {
      cy.request({
        method: 'POST',
        url: '/payment/webhook/test-id',
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
        expect(response.status, `Expected 200-series for POST /payment/webhook/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /payment/webhook/test-id: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /payment/methods/${methodId}/default', () => {
      cy.request({
        method: 'PUT',
        url: '/payment/methods/test-id/default',
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
        expect(response.status, `Expected 200-series for PUT /payment/methods/test-id/default`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /payment/methods/test-id/default: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /payment/methods/${methodId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/payment/methods/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /payment/methods/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /payment/methods/test-id: ${response.status}`);
      });
    });

  });

});
