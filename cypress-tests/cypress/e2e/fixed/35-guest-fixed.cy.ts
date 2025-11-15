/**
 * FIXED API Tests for Guest Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.941Z
 * Endpoints: 9
 */

describe('✅ Guest Module - ALL 200s', () => {
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

  describe('POST Requests', () => {
    it('should return 200 for POST /guest/checkout/calculate', () => {
      cy.request({
        method: 'POST',
        url: '/guest/checkout/calculate',
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
        expect(response.status, `Expected 200-series for POST /guest/checkout/calculate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/checkout/calculate: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/checkout/initialize', () => {
      cy.request({
        method: 'POST',
        url: '/guest/checkout/initialize',
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
        expect(response.status, `Expected 200-series for POST /guest/checkout/initialize`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/checkout/initialize: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/checkout/submit', () => {
      cy.request({
        method: 'POST',
        url: '/guest/checkout/submit',
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
        expect(response.status, `Expected 200-series for POST /guest/checkout/submit`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/checkout/submit: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/checkout/validate', () => {
      cy.request({
        method: 'POST',
        url: '/guest/checkout/validate',
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
        expect(response.status, `Expected 200-series for POST /guest/checkout/validate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/checkout/validate: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/convert-to-account', () => {
      cy.request({
        method: 'POST',
        url: '/guest/convert-to-account',
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
        expect(response.status, `Expected 200-series for POST /guest/convert-to-account`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/convert-to-account: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/orders/send-confirmation', () => {
      cy.request({
        method: 'POST',
        url: '/guest/orders/send-confirmation',
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
        expect(response.status, `Expected 200-series for POST /guest/orders/send-confirmation`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/orders/send-confirmation: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/orders/track', () => {
      cy.request({
        method: 'POST',
        url: '/guest/orders/track',
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
        expect(response.status, `Expected 200-series for POST /guest/orders/track`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/orders/track: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/promo/apply', () => {
      cy.request({
        method: 'POST',
        url: '/guest/promo/apply',
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
        expect(response.status, `Expected 200-series for POST /guest/promo/apply`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/promo/apply: ${response.status}`);
      });
    });

    it('should return 200 for POST /guest/shipping/methods', () => {
      cy.request({
        method: 'POST',
        url: '/guest/shipping/methods',
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
        expect(response.status, `Expected 200-series for POST /guest/shipping/methods`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /guest/shipping/methods: ${response.status}`);
      });
    });

  });

});
