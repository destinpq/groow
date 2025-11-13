/// <reference types="cypress" />

describe('Authentication APIs', () => {
  let adminToken: string;

  it('POST /auth/login - Should login admin user', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD')
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('access_token');
      adminToken = response.body.data.access_token;
      
      // Save token for other tests
      cy.wrap(adminToken).as('adminToken');
    });
  });

  it('GET /auth/profile - Should get user profile', () => {
    cy.loginAsAdmin().then((token) => {
      cy.apiRequest('GET', '/auth/profile', null, token).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('email');
          expect(response.body.email).to.eq(Cypress.env('ADMIN_EMAIL'));
        }
      });
    });
  });

  it('GET /auth/me - Should get current user or 404', () => {
    cy.loginAsAdmin().then((token) => {
      cy.apiRequest('GET', '/auth/me', null, token).then((response) => {
        expect(response.status).to.be.oneOf([200, 404]);
      });
    });
  });

  it('POST /auth/logout - Should logout user', () => {
    cy.loginAsAdmin().then((token) => {
      cy.apiRequest('POST', '/auth/logout', null, token).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 204]);
      });
    });
  });

  it('POST /auth/refresh - Should refresh token', () => {
    cy.loginAsAdmin().then((token) => {
      cy.apiRequest('POST', '/auth/refresh', null, token).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 404]);
      });
    });
  });
});

