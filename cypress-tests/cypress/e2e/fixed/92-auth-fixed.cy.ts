/**
 * FIXED API Tests for Auth Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.912Z
 * Endpoints: 38
 */

describe('✅ Auth Module - ALL 200s', () => {
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
    it('should return 200 for GET /auth/attempts', () => {
      cy.request({
        method: 'GET',
        url: '/auth/attempts',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /auth/attempts`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /auth/attempts: ${response.status}`);
      });
    });

    it('should return 200 for GET /auth/devices', () => {
      cy.request({
        method: 'GET',
        url: '/auth/devices',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /auth/devices`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /auth/devices: ${response.status}`);
      });
    });

    it('should return 200 for GET /auth/me', () => {
      cy.request({
        method: 'GET',
        url: '/auth/me',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /auth/me`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /auth/me: ${response.status}`);
      });
    });

    it('should return 200 for GET /auth/profile', () => {
      cy.request({
        method: 'GET',
        url: '/auth/profile',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /auth/profile`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /auth/profile: ${response.status}`);
      });
    });

    it('should return 200 for GET /auth/providers', () => {
      cy.request({
        method: 'GET',
        url: '/auth/providers',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /auth/providers`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /auth/providers: ${response.status}`);
      });
    });

    it('should return 200 for GET /auth/sessions', () => {
      cy.request({
        method: 'GET',
        url: '/auth/sessions',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /auth/sessions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /auth/sessions: ${response.status}`);
      });
    });

    it('should return 200 for GET /auth/tokens', () => {
      cy.request({
        method: 'GET',
        url: '/auth/tokens',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /auth/tokens`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /auth/tokens: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST ${API_BASE_URL}/auth/refresh', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/auth/refresh',
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
        expect(response.status, `Expected 200-series for POST test-id/auth/refresh`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/auth/refresh: ${response.status}`);
      });
    });

    it('should return 200 for POST ${this.baseURL}/auth/login', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/auth/login',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "email": "admin@groow.com",
          "password": "Admin@123456"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST test-id/auth/login`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/auth/login: ${response.status}`);
      });
    });

    it('should return 200 for POST ${this.baseURL}/auth/logout', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/auth/logout',
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
        expect(response.status, `Expected 200-series for POST test-id/auth/logout`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/auth/logout: ${response.status}`);
      });
    });

    it('should return 200 for POST ${this.baseURL}/auth/refresh', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/auth/refresh',
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
        expect(response.status, `Expected 200-series for POST test-id/auth/refresh`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/auth/refresh: ${response.status}`);
      });
    });

    it('should return 200 for POST ${this.baseURL}/auth/register', () => {
      cy.request({
        method: 'POST',
        url: 'test-id/auth/register',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "email": "test@example.com",
          "password": "Test@123456",
          "firstName": "Test",
          "lastName": "User",
          "role": "customer"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST test-id/auth/register`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST test-id/auth/register: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/change-password', () => {
      cy.request({
        method: 'POST',
        url: '/auth/change-password',
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
        expect(response.status, `Expected 200-series for POST /auth/change-password`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/change-password: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/delete-account', () => {
      cy.request({
        method: 'POST',
        url: '/auth/delete-account',
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
        expect(response.status, `Expected 200-series for POST /auth/delete-account`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/delete-account: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/devices', () => {
      cy.request({
        method: 'POST',
        url: '/auth/devices',
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
        expect(response.status, `Expected 200-series for POST /auth/devices`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/devices: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/login', () => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "email": "admin@groow.com",
          "password": "Admin@123456"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /auth/login`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/login: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/logout', () => {
      cy.request({
        method: 'POST',
        url: '/auth/logout',
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
        expect(response.status, `Expected 200-series for POST /auth/logout`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/logout: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/magic-links', () => {
      cy.request({
        method: 'POST',
        url: '/auth/magic-links',
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
        expect(response.status, `Expected 200-series for POST /auth/magic-links`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/magic-links: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/magic-links/validate', () => {
      cy.request({
        method: 'POST',
        url: '/auth/magic-links/validate',
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
        expect(response.status, `Expected 200-series for POST /auth/magic-links/validate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/magic-links/validate: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/mfa/disable', () => {
      cy.request({
        method: 'POST',
        url: '/auth/mfa/disable',
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
        expect(response.status, `Expected 200-series for POST /auth/mfa/disable`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/mfa/disable: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/mfa/setup', () => {
      cy.request({
        method: 'POST',
        url: '/auth/mfa/setup',
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
        expect(response.status, `Expected 200-series for POST /auth/mfa/setup`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/mfa/setup: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/mfa/verify-setup', () => {
      cy.request({
        method: 'POST',
        url: '/auth/mfa/verify-setup',
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
        expect(response.status, `Expected 200-series for POST /auth/mfa/verify-setup`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/mfa/verify-setup: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/password-change', () => {
      cy.request({
        method: 'POST',
        url: '/auth/password-change',
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
        expect(response.status, `Expected 200-series for POST /auth/password-change`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/password-change: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/password-reset/complete', () => {
      cy.request({
        method: 'POST',
        url: '/auth/password-reset/complete',
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
        expect(response.status, `Expected 200-series for POST /auth/password-reset/complete`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/password-reset/complete: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/password-reset/initiate', () => {
      cy.request({
        method: 'POST',
        url: '/auth/password-reset/initiate',
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
        expect(response.status, `Expected 200-series for POST /auth/password-reset/initiate`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/password-reset/initiate: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/refresh', () => {
      cy.request({
        method: 'POST',
        url: '/auth/refresh',
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
        expect(response.status, `Expected 200-series for POST /auth/refresh`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/refresh: ${response.status}`);
      });
    });

    it('should return 200 for POST /auth/register', () => {
      cy.request({
        method: 'POST',
        url: '/auth/register',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: {
          "email": "test@example.com",
          "password": "Test@123456",
          "firstName": "Test",
          "lastName": "User",
          "role": "customer"
},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for POST /auth/register`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /auth/register: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /auth/devices/${deviceId}/trust', () => {
      cy.request({
        method: 'PUT',
        url: '/auth/devices/test-id/trust',
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
        expect(response.status, `Expected 200-series for PUT /auth/devices/test-id/trust`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /auth/devices/test-id/trust: ${response.status}`);
      });
    });

    it('should return 200 for PUT /auth/profile', () => {
      cy.request({
        method: 'PUT',
        url: '/auth/profile',
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
        expect(response.status, `Expected 200-series for PUT /auth/profile`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /auth/profile: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /auth/devices/${deviceId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/auth/devices/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /auth/devices/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /auth/devices/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /auth/sessions/${sessionId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/auth/sessions/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /auth/sessions/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /auth/sessions/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /auth/social/${provider}', () => {
      cy.request({
        method: 'DELETE',
        url: '/auth/social/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /auth/social/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /auth/social/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /auth/tokens/${tokenId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/auth/tokens/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /auth/tokens/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /auth/tokens/test-id: ${response.status}`);
      });
    });

  });

});
