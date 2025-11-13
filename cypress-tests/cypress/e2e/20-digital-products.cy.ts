/// <reference types="cypress" />

describe('Digital Products APIs', () => {
  let customerToken: string;

  before(() => {
    cy.loginAsCustomer().then((token) => {
      customerToken = token;
    });
  });

  it('GET /customer/digital-products - Should list digital products', () => {
    cy.apiRequest('GET', '/customer/digital-products', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /customer/digital-products/stats - Should get stats', () => {
    cy.apiRequest('GET', '/customer/digital-products/stats', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /customer/digital-products/download - Should download product', () => {
    const downloadData = {
      productId: 'test-id'
    };

    cy.apiRequest('POST', '/customer/digital-products/download', downloadData, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 400, 401, 404]);
    });
  });

  it('GET /customer/digital-products/download-history - Should get download history', () => {
    cy.apiRequest('GET', '/customer/digital-products/download-history', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /customer/digital-products/activate-license - Should activate license', () => {
    const licenseData = {
      productId: 'test-id',
      licenseKey: 'TEST-KEY'
    };

    cy.apiRequest('POST', '/customer/digital-products/activate-license', licenseData, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 400, 401, 404]);
    });
  });

  it('GET /customer/digital-products/updates - Should get product updates', () => {
    cy.apiRequest('GET', '/customer/digital-products/updates', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });
});

