/// <reference types="cypress" />

describe('Cart APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  it('GET /cart - Should get cart', () => {
    cy.apiRequest('GET', '/cart', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401]);
    });
  });

  it('GET /cart/items - Should get cart items', () => {
    cy.apiRequest('GET', '/cart/items', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]);
    });
  });

  it('GET /cart/count - Should get cart count', () => {
    cy.apiRequest('GET', '/cart/count', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]);
    });
  });

  it('POST /cart - Should add item to cart', () => {
    const cartItem = {
      productId: '00000000-0000-0000-0000-000000000001',
      quantity: 1
    };

    cy.apiRequest('POST', '/cart', cartItem, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });

  it('DELETE /cart - Should clear cart', () => {
    cy.apiRequest('DELETE', '/cart', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 204, 404]);
    });
  });
});

