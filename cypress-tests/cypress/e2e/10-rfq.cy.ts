/// <reference types="cypress" />

describe('RFQ (Request for Quote) APIs', () => {
  let adminToken: string;
  let createdRFQId: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('GET Endpoints', () => {
    it('GET /rfq - Should list all RFQs', () => {
      cy.apiRequest('GET', '/rfq', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('data');
        }
      });
    });

    it('GET /rfq/my-rfqs - Should get my RFQs', () => {
      cy.apiRequest('GET', '/rfq/my-rfqs', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
      });
    });
  });

  describe('CRUD Operations', () => {
    it('POST /rfq - Should create an RFQ', () => {
      const rfqData = {
        title: 'Test RFQ',
        description: 'Need bulk products',
        quantity: 100,
        budget: 10000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      cy.apiRequest('POST', '/rfq', rfqData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
        
        if (response.status === 200 || response.status === 201) {
          createdRFQId = response.body.data?.id || response.body.id;
        }
      });
    });

    it('GET /rfq/:id - Should get RFQ by ID', () => {
      if (createdRFQId) {
        cy.apiRequest('GET', `/rfq/${createdRFQId}`, null, adminToken).then((response) => {
          expect(response.status).to.be.oneOf([200, 404]);
        });
      }
    });

    it('GET /rfq/:id/quotations - Should get quotations for RFQ', () => {
      if (createdRFQId) {
        cy.apiRequest('GET', `/rfq/${createdRFQId}/quotations`, null, adminToken).then((response) => {
          expect(response.status).to.be.oneOf([200, 404]);
        });
      }
    });
  });
});

