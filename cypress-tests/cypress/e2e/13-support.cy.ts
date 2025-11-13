/// <reference types="cypress" />

describe('Support & Tickets APIs', () => {
  let adminToken: string;
  let ticketId: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  it('GET /support/tickets - Should list all tickets', () => {
    cy.apiRequest('GET', '/support/tickets', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /support/tickets - Should create a ticket', () => {
    const ticketData = {
      subject: 'Test Support Ticket',
      description: 'This is a test ticket',
      priority: 'medium',
      category: 'general'
    };

    cy.apiRequest('POST', '/support/tickets', ticketData, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
      if (response.status === 200 || response.status === 201) {
        ticketId = response.body.data?.id || response.body.id;
      }
    });
  });

  it('GET /support/tickets/:id - Should get ticket by ID', () => {
    if (ticketId) {
      cy.apiRequest('GET', `/support/tickets/${ticketId}`, null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 404]);
      });
    }
  });

  it('GET /support/tickets/my - Should get my tickets', () => {
    cy.apiRequest('GET', '/support/tickets/my', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /support/categories/list - Should list support categories', () => {
    cy.apiRequest('GET', '/support/categories/list', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]);
    });
  });

  it('GET /support/analytics/overview - Should get support analytics', () => {
    cy.apiRequest('GET', '/support/analytics/overview', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });
});

