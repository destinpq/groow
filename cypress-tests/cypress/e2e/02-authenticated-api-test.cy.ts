/**
 * Authenticated API Test Suite
 * Tests ALL protected endpoints with JWT authentication
 * Proves that 401 endpoints work correctly with auth tokens
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
  getTestResults,
} from '../support/api-test-helpers';

describe('🔐 Authenticated API Test Suite - Proving 401s Work', () => {
  let adminToken: string;
  let vendorToken: string;
  let customerToken: string;

  before(() => {
    initializeTestSession();
    cy.task('log', '🔐 Starting authenticated API testing...');
    
    // Get admin token
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        adminToken = response.body.data?.accessToken || 
                    response.body.data?.access_token ||
                    response.body.accessToken ||
                    response.body.token;
        cy.task('log', `✅ Admin authenticated: ${adminToken ? 'Yes' : 'No'}`);
        if (adminToken) {
          cy.task('log', `📝 Token: ${adminToken.substring(0, 30)}...`);
        }
      } else {
        cy.task('log', `⚠️  Admin login returned: ${response.status}`);
      }
    });
  });

  after(() => {
    cy.task('log', '📝 Generating authenticated test reports...');
    saveTestReport('authenticated-api-test-report.json');
    
    const results = getTestResults();
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const improved = results.filter(r => 
      r.statusCode === 200 && r.requiresAuth
    ).length;
    
    cy.task('log', `✅ Tests Passed: ${passed}`);
    cy.task('log', `❌ Tests Failed: ${failed}`);
    cy.task('log', `🎯 Protected endpoints working with auth: ${improved}`);
    cy.task('log', '📁 Report: cypress/reports/api-test-report.html');
  });

  // ============================================
  // ADMIN ENDPOINTS - Should work with admin token
  // ============================================
  describe('👑 Admin Endpoints (with auth token)', () => {
    it('should access admin dashboard with auth', () => {
      cy.then(() => {
        testAPI('GET', '/admin/dashboard', 200, 'Admin', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Admin dashboard with JWT',
        });
      });
    });

    it('should access admin users list with auth', () => {
      cy.then(() => {
        testAPI('GET', '/admin/users', 200, 'Admin', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Admin users with JWT',
        });
      });
    });

    it('should access admin analytics with auth', () => {
      cy.then(() => {
        testAPI('GET', '/admin/analytics', 200, 'Admin', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Admin analytics with JWT',
        });
      });
    });

    it('should access admin products with auth', () => {
      cy.then(() => {
        testAPI('GET', '/admin/products', 200, 'Admin', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Admin products with JWT',
        });
      });
    });

    it('should access admin orders with auth', () => {
      cy.then(() => {
        testAPI('GET', '/admin/orders', 200, 'Admin', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Admin orders with JWT',
        });
      });
    });

    it('should access admin reports with auth', () => {
      cy.then(() => {
        testAPI('GET', '/admin/reports', 200, 'Admin', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Admin reports with JWT',
        });
      });
    });

    it('should access admin settings with auth', () => {
      cy.then(() => {
        testAPI('GET', '/admin/settings', 200, 'Admin', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Admin settings with JWT',
        });
      });
    });
  });

  // ============================================
  // VENDOR ENDPOINTS - Test with admin token (should work if admin has access)
  // ============================================
  describe('🏪 Vendor Endpoints (with auth token)', () => {
    it('should access vendor profile with auth', () => {
      cy.then(() => {
        testAPI('GET', '/vendors/profile', 200, 'Vendor', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Vendor profile with JWT',
        });
      });
    });

    it('should access vendor dashboard with auth', () => {
      cy.then(() => {
        testAPI('GET', '/vendors/dashboard', 200, 'Vendor', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Vendor dashboard with JWT',
        });
      });
    });

    it('should access vendor products with auth', () => {
      cy.then(() => {
        testAPI('GET', '/vendors/products', 200, 'Vendor', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Vendor products with JWT',
        });
      });
    });

    it('should access vendor orders with auth', () => {
      cy.then(() => {
        testAPI('GET', '/vendors/orders', 200, 'Vendor', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Vendor orders with JWT',
        });
      });
    });

    it('should access vendor analytics with auth', () => {
      cy.then(() => {
        testAPI('GET', '/vendors/analytics', 200, 'Vendor', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Vendor analytics with JWT',
        });
      });
    });
  });

  // ============================================
  // CUSTOMER ENDPOINTS
  // ============================================
  describe('👤 Customer Endpoints (with auth token)', () => {
    it('should access customer profile with auth', () => {
      cy.then(() => {
        testAPI('GET', '/customers/profile', 200, 'Customer', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Customer profile with JWT',
        });
      });
    });

    it('should access customer orders with auth', () => {
      cy.then(() => {
        testAPI('GET', '/customers/orders', 200, 'Customer', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Customer orders with JWT',
        });
      });
    });

    it('should access customer wishlist with auth', () => {
      cy.then(() => {
        testAPI('GET', '/customers/wishlist', 200, 'Customer', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Customer wishlist with JWT',
        });
      });
    });

    it('should access customer addresses with auth', () => {
      cy.then(() => {
        testAPI('GET', '/customers/addresses', 200, 'Customer', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Customer addresses with JWT',
        });
      });
    });
  });

  // ============================================
  // ORDERS ENDPOINTS
  // ============================================
  describe('📋 Order Endpoints (with auth token)', () => {
    it('should access orders list with auth', () => {
      cy.then(() => {
        testAPI('GET', '/orders', 200, 'Orders', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Orders list with JWT',
        });
      });
    });

    it('should access order tracking with auth', () => {
      cy.then(() => {
        testAPI('GET', '/orders/tracking', 200, 'Orders', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Order tracking with JWT',
        });
      });
    });
  });

  // ============================================
  // FINANCE ENDPOINTS
  // ============================================
  describe('💰 Finance Endpoints (with auth token)', () => {
    it('should access finance transactions with auth', () => {
      cy.then(() => {
        testAPI('GET', '/finance/transactions', 200, 'Finance', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Finance transactions with JWT',
        });
      });
    });

    it('should access finance payouts with auth', () => {
      cy.then(() => {
        testAPI('GET', '/finance/payouts', 200, 'Finance', {
          requiresAuth: true,
          authToken: adminToken,
          description: 'Finance payouts with JWT',
        });
      });
    });
  });

  // ============================================
  // COMPARISON: Same endpoints WITHOUT auth (should return 401)
  // ============================================
  describe('🔒 Proving 401s are correct (without auth)', () => {
    it('should return 401 for admin dashboard without auth', () => {
      testAPI('GET', '/admin/dashboard', 401, 'Security Check', {
        requiresAuth: false,
        description: 'Admin dashboard without JWT (should be 401)',
      });
    });

    it('should return 401 for vendor profile without auth', () => {
      testAPI('GET', '/vendors/profile', 401, 'Security Check', {
        requiresAuth: false,
        description: 'Vendor profile without JWT (should be 401)',
      });
    });

    it('should return 401 for customer profile without auth', () => {
      testAPI('GET', '/customers/profile', 401, 'Security Check', {
        requiresAuth: false,
        description: 'Customer profile without JWT (should be 401)',
      });
    });

    it('should return 401 for orders without auth', () => {
      testAPI('GET', '/orders', 401, 'Security Check', {
        requiresAuth: false,
        description: 'Orders without JWT (should be 401)',
      });
    });

    it('should return 401 for finance transactions without auth', () => {
      testAPI('GET', '/finance/transactions', 401, 'Security Check', {
        requiresAuth: false,
        description: 'Finance without JWT (should be 401)',
      });
    });
  });
});

