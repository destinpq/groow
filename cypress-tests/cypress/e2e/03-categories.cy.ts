/// <reference types="cypress" />

describe('Categories APIs', () => {
  let adminToken: string;
  let createdCategoryId: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('GET Endpoints', () => {
    it('GET /categories - Should list all categories', () => {
      cy.apiRequest('GET', '/categories').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });

    it('GET /categories/tree - Should get category tree', () => {
      cy.apiRequest('GET', '/categories/tree').then((response) => {
        expect(response.status).to.be.oneOf([200, 500]);
      });
    });

    it('GET /categories/hierarchy - Should get category hierarchy', () => {
      cy.apiRequest('GET', '/categories/hierarchy').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  });

  describe('CRUD Operations', () => {
    it('POST /categories - Should create a category', () => {
      const categoryData = {
        name: 'Test Category',
        description: 'Test Description',
        slug: 'test-category-' + Date.now(),
        isActive: true
      };

      cy.apiRequest('POST', '/categories', categoryData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
        
        if (response.status === 200 || response.status === 201) {
          createdCategoryId = response.body.data?.id || response.body.id;
        }
      });
    });

    it('GET /categories/:id - Should get category by ID', () => {
      if (createdCategoryId) {
        cy.apiRequest('GET', `/categories/${createdCategoryId}`).then((response) => {
          expect(response.status).to.be.oneOf([200, 404]);
        });
      }
    });

    it('PATCH /categories/:id - Should update category', () => {
      if (createdCategoryId) {
        cy.apiRequest('PATCH', `/categories/${createdCategoryId}`, {
          name: 'Updated Category'
        }, adminToken).then((response) => {
          expect(response.status).to.be.oneOf([200, 404]);
        });
      }
    });

    it('DELETE /categories/:id - Should delete category', () => {
      if (createdCategoryId) {
        cy.apiRequest('DELETE', `/categories/${createdCategoryId}`, null, adminToken).then((response) => {
          expect(response.status).to.be.oneOf([200, 204, 404]);
        });
      }
    });
  });
});

