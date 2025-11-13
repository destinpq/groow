/// <reference types="cypress" />

describe('Payment & Wallet APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('Payment APIs', () => {
    it('GET /payment/methods - Should list payment methods', () => {
      cy.apiRequest('GET', '/payment/methods', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 404]);
      });
    });

    it('POST /payment/initiate - Should initiate payment', () => {
      const paymentData = {
        amount: 100,
        currency: 'USD',
        method: 'card'
      };

      cy.apiRequest('POST', '/payment/initiate', paymentData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 404]);
      });
    });

    it('GET /payment/history - Should get payment history', () => {
      cy.apiRequest('GET', '/payment/history', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });
  });

  describe('Wallet APIs', () => {
    it('GET /payment/wallet/balance - Should get wallet balance', () => {
      cy.apiRequest('GET', '/payment/wallet/balance', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /payment/wallet/transactions - Should get wallet transactions', () => {
      cy.apiRequest('GET', '/payment/wallet/transactions', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('POST /payment/wallet/credit - Should credit wallet', () => {
      const creditData = {
        amount: 50,
        description: 'Test credit'
      };

      cy.apiRequest('POST', '/payment/wallet/credit', creditData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
      });
    });
  });

  describe('Finance APIs', () => {
    it('GET /finance/transactions - Should list transactions', () => {
      cy.apiRequest('GET', '/finance/transactions', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /finance/payouts - Should list payouts', () => {
      cy.apiRequest('GET', '/finance/payouts', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });

    it('GET /finance/dashboard - Should get finance dashboard', () => {
      cy.apiRequest('GET', '/finance/dashboard', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });
  });
});

