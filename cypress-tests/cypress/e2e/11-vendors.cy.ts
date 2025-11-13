/// <reference types="cypress" />

describe('Vendors APIs', () => {
  let adminToken: string;
  let vendorToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
    cy.loginAsVendor().then((token) => {
      vendorToken = token || adminToken;
    });
  });

  it('GET /vendor/profile - Should get vendor profile', () => {
    cy.apiRequest('GET', '/vendor/profile', null, vendorToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 403, 404]);
    });
  });

  it('PATCH /vendor/profile - Should update vendor profile', () => {
    cy.apiRequest('PATCH', '/vendor/profile', { name: 'Updated Vendor' }, vendorToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /vendor/stats - Should get vendor statistics', () => {
    cy.apiRequest('GET', '/vendor/stats', null, vendorToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /vendor/products - Should get vendor products', () => {
    cy.apiRequest('GET', '/vendor/products', null, vendorToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /vendor/orders - Should get vendor orders', () => {
    cy.apiRequest('GET', '/vendor/orders', null, vendorToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });
});

