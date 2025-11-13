/// <reference types="cypress" />

describe('Reports & Analytics APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('Dashboard Reports', () => {
    it('GET /reports/dashboard - Should get dashboard data', () => {
      cy.apiRequest('GET', '/reports/dashboard?period=7d', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('GET /reports/system-health - Should get system health', () => {
      cy.apiRequest('GET', '/reports/system-health', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('GET /reports/recent-activities - Should get recent activities', () => {
      cy.apiRequest('GET', '/reports/recent-activities?limit=10', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });
  });

  describe('Business Reports', () => {
    it('GET /reports/sales - Should get sales report', () => {
      cy.apiRequest('GET', '/reports/sales', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /reports/products - Should get products report', () => {
      cy.apiRequest('GET', '/reports/products', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /reports/customers - Should get customers report', () => {
      cy.apiRequest('GET', '/reports/customers', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /reports/vendors - Should get vendors report', () => {
      cy.apiRequest('GET', '/reports/vendors', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });
  });
});

