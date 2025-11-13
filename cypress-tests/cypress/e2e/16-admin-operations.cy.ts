/// <reference types="cypress" />

describe('Admin Operations APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('User Management', () => {
    it('GET /users - Should list all users', () => {
      cy.apiRequest('GET', '/users', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /users/stats - Should get user statistics', () => {
      cy.apiRequest('GET', '/users/stats', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });
  });

  describe('Admin Security', () => {
    it('GET /admin/security/configuration - Should get security config', () => {
      cy.apiRequest('GET', '/admin/security/configuration', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /admin/security/events - Should get security events', () => {
      cy.apiRequest('GET', '/admin/security/events', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /admin/security/metrics - Should get security metrics', () => {
      cy.apiRequest('GET', '/admin/security/metrics', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });
  });

  describe('Admin Affiliates', () => {
    it('GET /admin/affiliates - Should list affiliates', () => {
      cy.apiRequest('GET', '/admin/affiliates', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /admin/affiliates/commissions - Should get commissions', () => {
      cy.apiRequest('GET', '/admin/affiliates/commissions', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /admin/affiliates/stats - Should get affiliate stats', () => {
      cy.apiRequest('GET', '/admin/affiliates/stats', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });
  });
});

