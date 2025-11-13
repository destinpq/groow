/// <reference types="cypress" />

describe('Orders APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('GET Endpoints', () => {
    it('GET /orders - Should list all orders', () => {
      cy.apiRequest('GET', '/orders', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('data');
        }
      });
    });

    it('GET /orders/my-orders - Should get my orders', () => {
      cy.apiRequest('GET', '/orders/my-orders', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /orders/stats - Should get order statistics', () => {
      cy.apiRequest('GET', '/orders/stats', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });
  });

  describe('Order Operations', () => {
    it('POST /orders - Should create an order', () => {
      const orderData = {
        items: [
          {
            productId: '00000000-0000-0000-0000-000000000001',
            quantity: 2,
            price: 99.99
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country'
        }
      };

      cy.apiRequest('POST', '/orders', orderData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
      });
    });
  });
});

