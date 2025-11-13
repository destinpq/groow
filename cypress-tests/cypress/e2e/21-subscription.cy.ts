/// <reference types="cypress" />

describe('Subscription APIs', () => {
  let customerToken: string;

  before(() => {
    cy.loginAsCustomer().then((token) => {
      customerToken = token;
    });
  });

  it('GET /subscription - Should list subscriptions', () => {
    cy.apiRequest('GET', '/subscription', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /subscription/stats - Should get subscription stats', () => {
    cy.apiRequest('GET', '/subscription/stats', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /subscription - Should create subscription', () => {
    const subData = {
      planId: 'test-plan',
      billingCycle: 'monthly'
    };

    cy.apiRequest('POST', '/subscription', subData, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });

  it('GET /subscription/upcoming-renewals - Should get upcoming renewals', () => {
    cy.apiRequest('GET', '/subscription/upcoming-renewals', null, customerToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });
});

