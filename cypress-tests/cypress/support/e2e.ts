// Cypress support file for API testing

// Global variables
let authToken: string | null = null;
let adminToken: string | null = null;
let vendorToken: string | null = null;
let customerToken: string | null = null;

// Custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login as admin and get token
       */
      loginAsAdmin(): Chainable<string>;
      
      /**
       * Login as vendor and get token
       */
      loginAsVendor(): Chainable<string>;
      
      /**
       * Login as customer and get token
       */
      loginAsCustomer(): Chainable<string>;
      
      /**
       * Make authenticated API request
       */
      apiRequest(method: string, url: string, body?: any, token?: string): Chainable<any>;
    }
  }
}

// Login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  if (adminToken) {
    return cy.wrap(adminToken);
  }
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_BASE_URL')}/auth/login`,
    body: {
      email: Cypress.env('ADMIN_EMAIL'),
      password: Cypress.env('ADMIN_PASSWORD')
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 || response.status === 201) {
      adminToken = response.body.data?.access_token || response.body.access_token || response.body.token;
      return adminToken;
    }
    throw new Error(`Login failed: ${response.status}`);
  });
});

// Login as vendor
Cypress.Commands.add('loginAsVendor', () => {
  if (vendorToken) {
    return cy.wrap(vendorToken);
  }
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_BASE_URL')}/auth/login`,
    body: {
      email: Cypress.env('VENDOR_EMAIL'),
      password: Cypress.env('VENDOR_PASSWORD')
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 || response.status === 201) {
      vendorToken = response.body.data?.access_token || response.body.access_token || response.body.token;
      return vendorToken;
    }
    return null;
  });
});

// Login as customer
Cypress.Commands.add('loginAsCustomer', () => {
  if (customerToken) {
    return cy.wrap(customerToken);
  }
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_BASE_URL')}/auth/login`,
    body: {
      email: Cypress.env('CUSTOMER_EMAIL'),
      password: Cypress.env('CUSTOMER_PASSWORD')
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 || response.status === 201) {
      customerToken = response.body.data?.access_token || response.body.access_token || response.body.token;
      return customerToken;
    }
    return null;
  });
});

// Make authenticated API request
Cypress.Commands.add('apiRequest', (method: string, url: string, body?: any, token?: string) => {
  const headers: any = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return cy.request({
    method,
    url: `${Cypress.env('API_BASE_URL')}${url}`,
    body,
    headers,
    failOnStatusCode: false
  });
});

// Global hooks
beforeEach(() => {
  cy.log('Test started');
});

afterEach(function() {
  if (this.currentTest?.state === 'failed') {
    cy.log(`Test failed: ${this.currentTest.title}`);
  }
});

