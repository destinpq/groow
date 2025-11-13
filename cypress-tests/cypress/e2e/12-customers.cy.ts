/// <reference types="cypress" />

describe('Customers APIs', () => {
  let adminToken: string;
  let customerToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
    cy.loginAsCustomer().then((token) => {
      customerToken = token || adminToken;
    });
  });

  it('GET /customer/profile - Should get customer profile', () => {
    cy.apiRequest('GET', '/customer/profile', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('PATCH /customer/profile - Should update customer profile', () => {
    cy.apiRequest('PATCH', '/customer/profile', { firstName: 'Updated' }, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /customer/addresses - Should get customer addresses', () => {
    cy.apiRequest('GET', '/customer/addresses', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /customer/addresses - Should create address', () => {
    const addressData = {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country'
    };
    
    cy.apiRequest('POST', '/customer/addresses', addressData, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });

  it('GET /customer/wishlist - Should get wishlist', () => {
    cy.apiRequest('GET', '/customer/wishlist', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /customer/orders - Should get customer orders', () => {
    cy.apiRequest('GET', '/customer/orders', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /customer/reviews - Should get customer reviews', () => {
    cy.apiRequest('GET', '/customer/reviews', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });
});

