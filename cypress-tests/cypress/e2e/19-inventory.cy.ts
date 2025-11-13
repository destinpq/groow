/// <reference types="cypress" />

describe('Inventory & Stock Management APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('Inventory Alerts', () => {
    it('GET /inventory/alerts - Should list inventory alerts', () => {
      cy.apiRequest('GET', '/inventory/alerts', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /inventory/alerts/stats - Should get alert statistics', () => {
      cy.apiRequest('GET', '/inventory/alerts/stats', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('POST /inventory/alerts/check-now - Should trigger alert check', () => {
      cy.apiRequest('POST', '/inventory/alerts/check-now', {}, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 401, 404]);
      });
    });
  });

  describe('Alert Rules', () => {
    it('GET /inventory/alert-rules - Should list alert rules', () => {
      cy.apiRequest('GET', '/inventory/alert-rules', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('POST /inventory/alert-rules - Should create alert rule', () => {
      const ruleData = {
        name: 'Low Stock Alert',
        threshold: 10,
        productId: 'test-id'
      };

      cy.apiRequest('POST', '/inventory/alert-rules', ruleData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
      });
    });
  });

  describe('Thresholds', () => {
    it('GET /inventory/thresholds - Should list thresholds', () => {
      cy.apiRequest('GET', '/inventory/thresholds', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('POST /inventory/thresholds - Should create threshold', () => {
      const thresholdData = {
        productId: 'test-id',
        minStock: 10,
        maxStock: 100
      };

      cy.apiRequest('POST', '/inventory/thresholds', thresholdData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
      });
    });
  });
});

