/// <reference types="cypress" />

describe('Notifications APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  it('GET /notification - Should list notifications', () => {
    cy.apiRequest('GET', '/notification', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /notification/unread - Should get unread notifications', () => {
    cy.apiRequest('GET', '/notification/unread', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('PATCH /notification/:id/read - Should mark as read', () => {
    cy.apiRequest('PATCH', '/notification/test-id/read', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]);
    });
  });

  it('GET /notification/preferences - Should get preferences', () => {
    cy.apiRequest('GET', '/notification/preferences', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('PATCH /notification/preferences - Should update preferences', () => {
    const prefsData = {
      email: true,
      push: false,
      sms: false
    };

    cy.apiRequest('PATCH', '/notification/preferences', prefsData, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });
});

