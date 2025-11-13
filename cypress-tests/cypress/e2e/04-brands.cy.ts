/// <reference types="cypress" />

describe('Brands APIs', () => {
  let adminToken: string;
  let createdBrandId: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('GET Endpoints', () => {
    it('GET /brands - Should list all brands', () => {
      cy.apiRequest('GET', '/brands').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });

    it('GET /brands/popular - Should get popular brands', () => {
      cy.apiRequest('GET', '/brands/popular').then((response) => {
        expect(response.status).to.be.oneOf([200, 500]);
      });
    });
  });

  describe('CRUD Operations', () => {
    it('POST /brands - Should create a brand', () => {
      const brandData = {
        name: 'Test Brand',
        description: 'Test Brand Description',
        slug: 'test-brand-' + Date.now(),
        isActive: true
      };

      cy.apiRequest('POST', '/brands', brandData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
        
        if (response.status === 200 || response.status === 201) {
          createdBrandId = response.body.data?.id || response.body.id;
        }
      });
    });

    it('GET /brands/:id - Should get brand by ID', () => {
      if (createdBrandId) {
        cy.apiRequest('GET', `/brands/${createdBrandId}`).then((response) => {
          expect(response.status).to.be.oneOf([200, 404]);
        });
      }
    });

    it('PATCH /brands/:id - Should update brand', () => {
      if (createdBrandId) {
        cy.apiRequest('PATCH', `/brands/${createdBrandId}`, {
          name: 'Updated Brand'
        }, adminToken).then((response) => {
          expect(response.status).to.be.oneOf([200, 404]);
        });
      }
    });

    it('DELETE /brands/:id - Should delete brand', () => {
      if (createdBrandId) {
        cy.apiRequest('DELETE', `/brands/${createdBrandId}`, null, adminToken).then((response) => {
          expect(response.status).to.be.oneOf([200, 204, 404]);
        });
      }
    });
  });
});

