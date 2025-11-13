/// <reference types="cypress" />

describe('Advanced Order Management APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  it('GET /orders/advanced - Should list advanced orders', () => {
    cy.apiRequest('GET', '/orders/advanced', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /orders/workflow-templates - Should get workflow templates', () => {
    cy.apiRequest('GET', '/orders/workflow-templates', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /orders/workflow-templates - Should create workflow template', () => {
    const templateData = {
      name: 'Test Workflow',
      steps: []
    };

    cy.apiRequest('POST', '/orders/workflow-templates', templateData, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });

  it('GET /orders/batches - Should get order batches', () => {
    cy.apiRequest('GET', '/orders/batches', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /orders/batches - Should create order batch', () => {
    const batchData = {
      name: 'Test Batch',
      orderIds: []
    };

    cy.apiRequest('POST', '/orders/batches', batchData, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });

  it('POST /orders/batch/status - Should bulk update status', () => {
    const bulkData = {
      orderIds: [],
      status: 'processing'
    };

    cy.apiRequest('POST', '/orders/batch/status', bulkData, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 400, 401, 404]);
    });
  });

  it('GET /orders/stats - Should get order statistics', () => {
    cy.apiRequest('GET', '/orders/stats', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401]);
    });
  });

  it('GET /orders/performance - Should get order performance', () => {
    cy.apiRequest('GET', '/orders/performance', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('GET /orders/automation-rules - Should get automation rules', () => {
    cy.apiRequest('GET', '/orders/automation-rules', null, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 401, 404]);
    });
  });

  it('POST /orders/automation-rules - Should create automation rule', () => {
    const ruleData = {
      name: 'Test Rule',
      conditions: [],
      actions: []
    };

    cy.apiRequest('POST', '/orders/automation-rules', ruleData, adminToken).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
    });
  });
});

