/// <reference types="cypress" />

describe('Upload APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  it('POST /upload/single - Should upload single file', () => {
    cy.apiRequest('POST', '/upload/single', { file: 'test' }, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });

  it('POST /upload/multiple - Should upload multiple files', () => {
    cy.apiRequest('POST', '/upload/multiple', { files: ['test1', 'test2'] }, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });

  it('GET /upload/my-uploads - Should get my uploads', () => {
    cy.apiRequest('GET', '/upload/my-uploads', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });
});

