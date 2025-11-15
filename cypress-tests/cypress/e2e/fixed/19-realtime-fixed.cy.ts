/**
 * FIXED API Tests for Realtime Module
 * ALL tests authenticate and expect 200-series responses
 * Generated: 2025-11-15T08:32:55.953Z
 * Endpoints: 38
 */

describe('✅ Realtime Module - ALL 200s', () => {
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
    it('should return 200 for GET /realtime/analytics', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/analytics',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/analytics`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/analytics: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/channels/${channel}/history', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/channels/test-id/history',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/channels/test-id/history`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/channels/test-id/history: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/connections', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/connections',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/connections`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/connections: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/connections/${connectionId}/status', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/connections/test-id/status',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/connections/test-id/status`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/connections/test-id/status: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/conversations/${conversationId}', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/conversations/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/conversations/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/conversations/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/conversations/${conversationId}/messages', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/conversations/test-id/messages',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/conversations/test-id/messages`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/conversations/test-id/messages: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/events/history', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/events/history',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/events/history`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/events/history: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/presence/${userId}', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/presence/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/presence/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/presence/test-id: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/users/${userId}/conversations', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/users/test-id/conversations',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/users/test-id/conversations`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/users/test-id/conversations: ${response.status}`);
      });
    });

    it('should return 200 for GET /realtime/users/${userId}/notifications', () => {
      cy.request({
        method: 'GET',
        url: '/realtime/users/test-id/notifications',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for GET /realtime/users/test-id/notifications`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ GET /realtime/users/test-id/notifications: ${response.status}`);
      });
    });

  });

  describe('POST Requests', () => {
    it('should return 200 for POST /realtime/connect', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/connect',
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
        expect(response.status, `Expected 200-series for POST /realtime/connect`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/connect: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/connections/${connectionId}/events/subscribe', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/connections/test-id/events/subscribe',
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
        expect(response.status, `Expected 200-series for POST /realtime/connections/test-id/events/subscribe`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/connections/test-id/events/subscribe: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/connections/${connectionId}/presence/subscribe', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/connections/test-id/presence/subscribe',
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
        expect(response.status, `Expected 200-series for POST /realtime/connections/test-id/presence/subscribe`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/connections/test-id/presence/subscribe: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/connections/${connectionId}/subscribe', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/connections/test-id/subscribe',
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
        expect(response.status, `Expected 200-series for POST /realtime/connections/test-id/subscribe`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/connections/test-id/subscribe: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/connections/${connectionId}/unsubscribe', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/connections/test-id/unsubscribe',
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
        expect(response.status, `Expected 200-series for POST /realtime/connections/test-id/unsubscribe`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/connections/test-id/unsubscribe: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/conversations', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/conversations',
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
        expect(response.status, `Expected 200-series for POST /realtime/conversations`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/conversations: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/conversations/${conversationId}/join', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/conversations/test-id/join',
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
        expect(response.status, `Expected 200-series for POST /realtime/conversations/test-id/join`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/conversations/test-id/join: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/conversations/${conversationId}/leave', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/conversations/test-id/leave',
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
        expect(response.status, `Expected 200-series for POST /realtime/conversations/test-id/leave`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/conversations/test-id/leave: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/conversations/${conversationId}/messages', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/conversations/test-id/messages',
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
        expect(response.status, `Expected 200-series for POST /realtime/conversations/test-id/messages`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/conversations/test-id/messages: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/events/publish', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/events/publish',
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
        expect(response.status, `Expected 200-series for POST /realtime/events/publish`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/events/publish: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/messages/${messageId}/reactions', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/messages/test-id/reactions',
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
        expect(response.status, `Expected 200-series for POST /realtime/messages/test-id/reactions`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/messages/test-id/reactions: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/messages/broadcast', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/messages/broadcast',
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
        expect(response.status, `Expected 200-series for POST /realtime/messages/broadcast`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/messages/broadcast: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/messages/direct', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/messages/direct',
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
        expect(response.status, `Expected 200-series for POST /realtime/messages/direct`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/messages/direct: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/messages/send', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/messages/send',
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
        expect(response.status, `Expected 200-series for POST /realtime/messages/send`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/messages/send: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/notifications/${notificationId}/actions/${actionId}', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/notifications/test-id/actions/test-id',
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
        expect(response.status, `Expected 200-series for POST /realtime/notifications/test-id/actions/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/notifications/test-id/actions/test-id: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/notifications/send', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/notifications/send',
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
        expect(response.status, `Expected 200-series for POST /realtime/notifications/send`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/notifications/send: ${response.status}`);
      });
    });

    it('should return 200 for POST /realtime/presence/bulk', () => {
      cy.request({
        method: 'POST',
        url: '/realtime/presence/bulk',
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
        expect(response.status, `Expected 200-series for POST /realtime/presence/bulk`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ POST /realtime/presence/bulk: ${response.status}`);
      });
    });

  });

  describe('PUT Requests', () => {
    it('should return 200 for PUT /realtime/connections/${connectionId}', () => {
      cy.request({
        method: 'PUT',
        url: '/realtime/connections/test-id',
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
        expect(response.status, `Expected 200-series for PUT /realtime/connections/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /realtime/connections/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /realtime/conversations/${conversationId}/read', () => {
      cy.request({
        method: 'PUT',
        url: '/realtime/conversations/test-id/read',
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
        expect(response.status, `Expected 200-series for PUT /realtime/conversations/test-id/read`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /realtime/conversations/test-id/read: ${response.status}`);
      });
    });

    it('should return 200 for PUT /realtime/messages/${messageId}', () => {
      cy.request({
        method: 'PUT',
        url: '/realtime/messages/test-id',
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
        expect(response.status, `Expected 200-series for PUT /realtime/messages/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /realtime/messages/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /realtime/messages/${messageId}/read', () => {
      cy.request({
        method: 'PUT',
        url: '/realtime/messages/test-id/read',
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
        expect(response.status, `Expected 200-series for PUT /realtime/messages/test-id/read`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /realtime/messages/test-id/read: ${response.status}`);
      });
    });

    it('should return 200 for PUT /realtime/notifications/${notificationId}/read', () => {
      cy.request({
        method: 'PUT',
        url: '/realtime/notifications/test-id/read',
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
        expect(response.status, `Expected 200-series for PUT /realtime/notifications/test-id/read`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /realtime/notifications/test-id/read: ${response.status}`);
      });
    });

    it('should return 200 for PUT /realtime/presence/${userId}', () => {
      cy.request({
        method: 'PUT',
        url: '/realtime/presence/test-id',
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
        expect(response.status, `Expected 200-series for PUT /realtime/presence/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /realtime/presence/test-id: ${response.status}`);
      });
    });

    it('should return 200 for PUT /realtime/users/${userId}/notifications/read-all', () => {
      cy.request({
        method: 'PUT',
        url: '/realtime/users/test-id/notifications/read-all',
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
        expect(response.status, `Expected 200-series for PUT /realtime/users/test-id/notifications/read-all`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ PUT /realtime/users/test-id/notifications/read-all: ${response.status}`);
      });
    });

  });

  describe('DELETE Requests', () => {
    it('should return 200 for DELETE /realtime/connections/${connectionId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/realtime/connections/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /realtime/connections/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /realtime/connections/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /realtime/messages/${messageId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/realtime/messages/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /realtime/messages/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /realtime/messages/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /realtime/messages/${messageId}/reactions/${reactionType}', () => {
      cy.request({
        method: 'DELETE',
        url: '/realtime/messages/test-id/reactions/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /realtime/messages/test-id/reactions/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /realtime/messages/test-id/reactions/test-id: ${response.status}`);
      });
    });

    it('should return 200 for DELETE /realtime/notifications/${notificationId}', () => {
      cy.request({
        method: 'DELETE',
        url: '/realtime/notifications/test-id',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        failOnStatusCode: false,
      }).then((response) => {
        // EXPECT ONLY 200-SERIES
        expect(response.status, `Expected 200-series for DELETE /realtime/notifications/test-id`)
          .to.be.within(200, 299);
        
        // Log actual status
        cy.log(`✅ DELETE /realtime/notifications/test-id: ${response.status}`);
      });
    });

  });

});
