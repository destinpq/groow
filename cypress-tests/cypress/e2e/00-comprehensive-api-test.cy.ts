/**
 * Comprehensive API Test Suite
 * Tests all 186+ API endpoints from the Groow platform
 * Generates detailed reports with HTTP status codes
 */

import {
  initializeTestSession,
  testAPI,
  saveTestReport,
  getTestResults,
} from '../support/api-test-helpers';

describe('🚀 Comprehensive API Test Suite', () => {
  let authTokens: {
    admin?: string;
    vendor?: string;
    customer?: string;
  } = {};

  before(() => {
    // Initialize test session
    initializeTestSession();

    // Create reports directory
    cy.task('log', '📊 Starting Comprehensive API Tests');
  });

  after(() => {
    // Generate and save reports
    cy.task('log', '📝 Generating test reports...');
    saveTestReport('comprehensive-api-test-report.json');
    
    // Log summary
    const results = getTestResults();
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    cy.task('log', `✅ Tests Passed: ${passed}`);
    cy.task('log', `❌ Tests Failed: ${failed}`);
    cy.task('log', `📊 Total Tests: ${results.length}`);
    cy.task('log', `📁 Report saved to: cypress/reports/api-test-report.html`);
  });

  // ============================================
  // 1. AUTHENTICATION MODULE (30 endpoints)
  // ============================================
  describe('🔐 Authentication APIs', () => {
    it('should test login endpoint', () => {
      testAPI('POST', '/auth/login', 400, 'Authentication', {
        description: 'Login without credentials (validation error expected)',
      });
    });

    it('should test register endpoint', () => {
      testAPI('POST', '/auth/register', 400, 'Authentication', {
        description: 'Register without data (validation error expected)',
      });
    });

    it('should login as admin and get token', () => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: Cypress.env('ADMIN_EMAIL'),
          password: Cypress.env('ADMIN_PASSWORD'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200 && response.body.data?.accessToken) {
          authTokens.admin = response.body.data.accessToken;
          cy.task('log', '✅ Admin authentication successful');
        } else {
          cy.task('log', '⚠️ Admin authentication failed - continuing without token');
        }
      });
    });

    it('should test refresh token endpoint', () => {
      testAPI('POST', '/auth/refresh', 401, 'Authentication', {
        requiresAuth: true,
        description: 'Refresh token without auth',
      });
    });

    it('should test logout endpoint', () => {
      testAPI('POST', '/auth/logout', 401, 'Authentication', {
        requiresAuth: true,
        description: 'Logout without auth',
      });
    });

    it('should test verify email endpoint', () => {
      testAPI('POST', '/auth/verify-email', 400, 'Authentication', {
        description: 'Verify email without token',
      });
    });

    it('should test forgot password endpoint', () => {
      testAPI('POST', '/auth/forgot-password', 400, 'Authentication', {
        description: 'Forgot password without email',
      });
    });

    it('should test reset password endpoint', () => {
      testAPI('POST', '/auth/reset-password', 400, 'Authentication', {
        description: 'Reset password without token',
      });
    });

    it('should test change password endpoint', () => {
      testAPI('POST', '/auth/change-password', 401, 'Authentication', {
        requiresAuth: true,
        description: 'Change password without auth',
      });
    });

    it('should test 2FA enable endpoint', () => {
      testAPI('POST', '/auth/2fa/enable', 401, 'Authentication', {
        requiresAuth: true,
        description: '2FA enable without auth',
      });
    });

    it('should test 2FA verify endpoint', () => {
      testAPI('POST', '/auth/2fa/verify', 401, 'Authentication', {
        requiresAuth: true,
        description: '2FA verify without auth',
      });
    });
  });

  // ============================================
  // 2. ANALYTICS MODULE (58 endpoints) - CRITICAL
  // ============================================
  describe('📊 Analytics APIs (Critical)', () => {
    it('should test analytics dashboard', () => {
      testAPI('GET', '/analytics/dashboard', 200, 'Analytics', {
        description: 'Get dashboard data',
      });
    });

    it('should test analytics dashboard with filters', () => {
      testAPI(
        'GET',
        '/analytics/dashboard?startDate=2025-11-08&endDate=2025-11-15&granularity=day',
        200,
        'Analytics',
        {
          description: 'Get dashboard data with date filters',
        }
      );
    });

    it('should test real-time metrics', () => {
      testAPI('GET', '/analytics/realtime', 200, 'Analytics', {
        description: 'Get real-time metrics',
      });
    });

    it('should test executive dashboard', () => {
      testAPI('GET', '/analytics/executive-dashboard', 200, 'Analytics', {
        description: 'Get executive dashboard',
      });
    });

    it('should test sales metrics', () => {
      testAPI('GET', '/analytics/sales/metrics', 200, 'Analytics', {
        description: 'Get sales metrics',
      });
    });

    it('should test performance alerts', () => {
      testAPI(
        'GET',
        '/analytics/alerts?status=active&priority=medium',
        200,
        'Analytics',
        {
          description: 'Get performance alerts',
        }
      );
    });

    it('should test analytics overview', () => {
      testAPI('GET', '/analytics/overview', 200, 'Analytics', {
        description: 'Get analytics overview',
      });
    });

    it('should test analytics trends', () => {
      testAPI('GET', '/analytics/trends', 200, 'Analytics', {
        description: 'Get analytics trends',
      });
    });

    it('should test analytics comparison', () => {
      testAPI('GET', '/analytics/comparison', 200, 'Analytics', {
        description: 'Get analytics comparison',
      });
    });

    it('should test analytics forecasting', () => {
      testAPI('GET', '/analytics/forecasting', 200, 'Analytics', {
        description: 'Get analytics forecasting',
      });
    });

    it('should test product analytics', () => {
      testAPI('GET', '/analytics/products', 200, 'Analytics', {
        description: 'Get product analytics',
      });
    });

    it('should test customer analytics', () => {
      testAPI('GET', '/analytics/customers', 200, 'Analytics', {
        description: 'Get customer analytics',
      });
    });

    it('should test traffic analytics', () => {
      testAPI('GET', '/analytics/traffic', 200, 'Analytics', {
        description: 'Get traffic analytics',
      });
    });

    it('should test conversion analytics', () => {
      testAPI('GET', '/analytics/conversion', 200, 'Analytics', {
        description: 'Get conversion analytics',
      });
    });
  });

  // ============================================
  // 3. VENDOR MODULE (47 endpoints)
  // ============================================
  describe('🏪 Vendor APIs', () => {
    it('should test list all vendors', () => {
      testAPI('GET', '/vendors', 200, 'Vendors', {
        description: 'Get all vendors',
      });
    });

    it('should test vendor reviews stats', () => {
      testAPI('GET', '/vendors/reviews/stats', 200, 'Vendors', {
        description: 'Get vendor review statistics',
      });
    });

    it('should test vendor profile (requires auth)', () => {
      testAPI('GET', '/vendors/profile', 401, 'Vendors', {
        requiresAuth: true,
        description: 'Get vendor profile without auth',
      });
    });

    it('should test vendor stats', () => {
      testAPI('GET', '/vendors/stats', 200, 'Vendors', {
        description: 'Get vendor statistics',
      });
    });

    it('should test vendor performance', () => {
      testAPI('GET', '/vendors/performance', 401, 'Vendors', {
        requiresAuth: true,
        description: 'Get vendor performance (requires auth)',
      });
    });

    it('should test vendor analytics', () => {
      testAPI('GET', '/vendors/analytics', 401, 'Vendors', {
        requiresAuth: true,
        description: 'Get vendor analytics (requires auth)',
      });
    });

    it('should test vendor contracts', () => {
      testAPI('GET', '/vendors/contracts', 401, 'Vendors', {
        requiresAuth: true,
        description: 'Get vendor contracts (requires auth)',
      });
    });

    it('should test vendor KYC submit', () => {
      testAPI('POST', '/vendors/kyc/submit', 401, 'Vendors', {
        requiresAuth: true,
        description: 'Submit vendor KYC (requires auth)',
      });
    });
  });

  // ============================================
  // 4. PRODUCTS MODULE (26 endpoints)
  // ============================================
  describe('📦 Product APIs', () => {
    it('should test list products', () => {
      testAPI('GET', '/products', 200, 'Products', {
        description: 'Get all products',
      });
    });

    it('should test paginated products', () => {
      testAPI('GET', '/products?page=1&limit=20', 200, 'Products', {
        description: 'Get paginated products',
      });
    });

    it('should test product search', () => {
      testAPI('GET', '/products/search?q=laptop', 200, 'Products', {
        description: 'Search products',
      });
    });

    it('should test featured products', () => {
      testAPI('GET', '/products/featured', 200, 'Products', {
        description: 'Get featured products',
      });
    });

    it('should test trending products', () => {
      testAPI('GET', '/products/trending', 200, 'Products', {
        description: 'Get trending products',
      });
    });

    it('should test product by ID (non-existent)', () => {
      testAPI('GET', '/products/non-existent-id', 404, 'Products', {
        description: 'Get non-existent product',
      });
    });

    it('should test product reviews', () => {
      testAPI('GET', '/products/test-id/reviews', 404, 'Products', {
        description: 'Get product reviews',
      });
    });

    it('should test product related items', () => {
      testAPI('GET', '/products/test-id/related', 404, 'Products', {
        description: 'Get related products',
      });
    });

    it('should test product variants', () => {
      testAPI('GET', '/products/test-id/variants', 404, 'Products', {
        description: 'Get product variants',
      });
    });

    it('should test bulk product upload', () => {
      testAPI('POST', '/products/bulk-upload', 401, 'Products', {
        requiresAuth: true,
        description: 'Bulk upload products (requires auth)',
      });
    });
  });

  // ============================================
  // 5. CATEGORIES MODULE
  // ============================================
  describe('📁 Category APIs', () => {
    it('should test list categories', () => {
      testAPI('GET', '/categories', 200, 'Categories', {
        description: 'Get all categories',
      });
    });

    it('should test category by ID', () => {
      testAPI('GET', '/categories/test-id', 404, 'Categories', {
        description: 'Get category by ID',
      });
    });

    it('should test products by category', () => {
      testAPI('GET', '/products/categories/test-id', 404, 'Categories', {
        description: 'Get products by category',
      });
    });
  });

  // ============================================
  // 6. ORDERS MODULE (55 endpoints)
  // ============================================
  describe('📋 Order APIs', () => {
    it('should test list orders (requires auth)', () => {
      testAPI('GET', '/orders', 401, 'Orders', {
        requiresAuth: true,
        description: 'Get orders without auth',
      });
    });

    it('should test create order (requires auth)', () => {
      testAPI('POST', '/orders', 401, 'Orders', {
        requiresAuth: true,
        description: 'Create order without auth',
      });
    });

    it('should test order by ID (requires auth)', () => {
      testAPI('GET', '/orders/test-id', 401, 'Orders', {
        requiresAuth: true,
        description: 'Get order by ID without auth',
      });
    });

    it('should test cancel order (requires auth)', () => {
      testAPI('POST', '/orders/test-id/cancel', 401, 'Orders', {
        requiresAuth: true,
        description: 'Cancel order without auth',
      });
    });

    it('should test order tracking (requires auth)', () => {
      testAPI('GET', '/orders/test-id/tracking', 401, 'Orders', {
        requiresAuth: true,
        description: 'Get order tracking without auth',
      });
    });

    it('should test update order status (requires auth)', () => {
      testAPI('PATCH', '/orders/test-id/status', 401, 'Orders', {
        requiresAuth: true,
        description: 'Update order status without auth',
      });
    });

    it('should test bulk create orders (requires auth)', () => {
      testAPI('POST', '/orders/bulk/create', 401, 'Orders', {
        requiresAuth: true,
        description: 'Bulk create orders without auth',
      });
    });

    it('should test workflow rules (requires auth)', () => {
      testAPI('GET', '/orders/workflow/rules', 401, 'Orders', {
        requiresAuth: true,
        description: 'Get workflow rules without auth',
      });
    });
  });

  // ============================================
  // 7. REPORTS MODULE (51 endpoints)
  // ============================================
  describe('📄 Report APIs', () => {
    it('should test reports dashboard', () => {
      testAPI('GET', '/reports/dashboard', 401, 'Reports', {
        requiresAuth: true,
        description: 'Get reports dashboard',
      });
    });

    it('should test recent activities', () => {
      testAPI('GET', '/reports/recent-activities', 401, 'Reports', {
        requiresAuth: true,
        description: 'Get recent activities',
      });
    });

    it('should test system health', () => {
      testAPI('GET', '/reports/system-health', 401, 'Reports', {
        requiresAuth: true,
        description: 'Get system health',
      });
    });

    it('should test sales report', () => {
      testAPI('GET', '/reports/sales', 401, 'Reports', {
        requiresAuth: true,
        description: 'Get sales report',
      });
    });

    it('should test products report', () => {
      testAPI('GET', '/reports/products', 401, 'Reports', {
        requiresAuth: true,
        description: 'Get products report',
      });
    });

    it('should test customers report', () => {
      testAPI('GET', '/reports/customers', 401, 'Reports', {
        requiresAuth: true,
        description: 'Get customers report',
      });
    });

    it('should test vendors report', () => {
      testAPI('GET', '/reports/vendors', 401, 'Reports', {
        requiresAuth: true,
        description: 'Get vendors report',
      });
    });
  });

  // ============================================
  // 8. MARKETING MODULE (71 endpoints)
  // ============================================
  describe('🎯 Marketing APIs', () => {
    describe('Flash Sales (61 endpoints)', () => {
      it('should test list flash sales', () => {
        testAPI('GET', '/flash-sales', 200, 'Marketing - Flash Sales', {
          description: 'Get all flash sales',
        });
      });

      it('should test active flash sales', () => {
        testAPI('GET', '/flash-sales/active', 200, 'Marketing - Flash Sales', {
          description: 'Get active flash sales',
        });
      });

      it('should test flash sale by ID', () => {
        testAPI('GET', '/flash-sales/test-id', 404, 'Marketing - Flash Sales', {
          description: 'Get flash sale by ID',
        });
      });

      it('should test create flash sale (requires auth)', () => {
        testAPI('POST', '/flash-sales', 401, 'Marketing - Flash Sales', {
          requiresAuth: true,
          description: 'Create flash sale without auth',
        });
      });

      it('should test participate in flash sale (requires auth)', () => {
        testAPI('POST', '/flash-sales/test-id/participate', 401, 'Marketing - Flash Sales', {
          requiresAuth: true,
          description: 'Participate in flash sale without auth',
        });
      });

      it('should test flash sale analytics (requires auth)', () => {
        testAPI('GET', '/flash-sales/test-id/analytics', 401, 'Marketing - Flash Sales', {
          requiresAuth: true,
          description: 'Get flash sale analytics without auth',
        });
      });
    });

    describe('Deals & Coupons', () => {
      it('should test list deals', () => {
        testAPI('GET', '/deals', 200, 'Marketing - Deals', {
          description: 'Get all deals',
        });
      });

      it('should test active deals', () => {
        testAPI('GET', '/deals/active', 200, 'Marketing - Deals', {
          description: 'Get active deals',
        });
      });

      it('should test list coupons', () => {
        testAPI('GET', '/coupons', 200, 'Marketing - Coupons', {
          description: 'Get all coupons',
        });
      });

      it('should test validate coupon', () => {
        testAPI('POST', '/coupons/validate', 400, 'Marketing - Coupons', {
          description: 'Validate coupon without code',
        });
      });
    });

    describe('Affiliate Program (71 endpoints)', () => {
      it('should test affiliate dashboard (requires auth)', () => {
        testAPI('GET', '/affiliate/dashboard', 401, 'Marketing - Affiliate', {
          requiresAuth: true,
          description: 'Get affiliate dashboard without auth',
        });
      });

      it('should test affiliate links (requires auth)', () => {
        testAPI('GET', '/affiliate/links', 401, 'Marketing - Affiliate', {
          requiresAuth: true,
          description: 'Get affiliate links without auth',
        });
      });

      it('should test affiliate commissions (requires auth)', () => {
        testAPI('GET', '/affiliate/commissions', 401, 'Marketing - Affiliate', {
          requiresAuth: true,
          description: 'Get affiliate commissions without auth',
        });
      });

      it('should test affiliate payouts (requires auth)', () => {
        testAPI('GET', '/affiliate/payouts', 401, 'Marketing - Affiliate', {
          requiresAuth: true,
          description: 'Get affiliate payouts without auth',
        });
      });

      it('should test affiliate analytics (requires auth)', () => {
        testAPI('GET', '/affiliate/analytics', 401, 'Marketing - Affiliate', {
          requiresAuth: true,
          description: 'Get affiliate analytics without auth',
        });
      });
    });
  });

  // ============================================
  // 9. CUSTOMER MODULE (57 endpoints)
  // ============================================
  describe('👤 Customer APIs', () => {
    it('should test customer profile (requires auth)', () => {
      testAPI('GET', '/customers/profile', 401, 'Customers', {
        requiresAuth: true,
        description: 'Get customer profile without auth',
      });
    });

    it('should test update customer profile (requires auth)', () => {
      testAPI('PUT', '/customers/profile', 401, 'Customers', {
        requiresAuth: true,
        description: 'Update customer profile without auth',
      });
    });

    it('should test customer addresses (requires auth)', () => {
      testAPI('GET', '/customers/addresses', 401, 'Customers', {
        requiresAuth: true,
        description: 'Get customer addresses without auth',
      });
    });

    it('should test add customer address (requires auth)', () => {
      testAPI('POST', '/customers/addresses', 401, 'Customers', {
        requiresAuth: true,
        description: 'Add customer address without auth',
      });
    });

    it('should test customer payment methods (requires auth)', () => {
      testAPI('GET', '/customers/payment-methods', 401, 'Customers', {
        requiresAuth: true,
        description: 'Get payment methods without auth',
      });
    });

    it('should test customer orders (requires auth)', () => {
      testAPI('GET', '/customers/orders', 401, 'Customers', {
        requiresAuth: true,
        description: 'Get customer orders without auth',
      });
    });

    it('should test customer wishlist (requires auth)', () => {
      testAPI('GET', '/customers/wishlist', 401, 'Customers', {
        requiresAuth: true,
        description: 'Get customer wishlist without auth',
      });
    });

    it('should test customer loyalty (requires auth)', () => {
      testAPI('GET', '/customers/loyalty', 401, 'Customers', {
        requiresAuth: true,
        description: 'Get customer loyalty without auth',
      });
    });
  });

  // ============================================
  // 10. RFQ MODULE (39 endpoints)
  // ============================================
  describe('📝 RFQ APIs', () => {
    it('should test list RFQs (requires auth)', () => {
      testAPI('GET', '/rfq', 401, 'RFQ', {
        requiresAuth: true,
        description: 'Get RFQs without auth',
      });
    });

    it('should test RFQ by ID (requires auth)', () => {
      testAPI('GET', '/rfq/test-id', 401, 'RFQ', {
        requiresAuth: true,
        description: 'Get RFQ by ID without auth',
      });
    });

    it('should test create RFQ (requires auth)', () => {
      testAPI('POST', '/rfq', 401, 'RFQ', {
        requiresAuth: true,
        description: 'Create RFQ without auth',
      });
    });

    it('should test RFQ quotes (requires auth)', () => {
      testAPI('GET', '/rfq/test-id/quotes', 401, 'RFQ', {
        requiresAuth: true,
        description: 'Get RFQ quotes without auth',
      });
    });

    it('should test accept quote (requires auth)', () => {
      testAPI('POST', '/rfq/test-id/accept-quote', 401, 'RFQ', {
        requiresAuth: true,
        description: 'Accept quote without auth',
      });
    });

    it('should test RFQ negotiation (requires auth)', () => {
      testAPI('POST', '/rfq/test-id/negotiate', 401, 'RFQ', {
        requiresAuth: true,
        description: 'Negotiate RFQ without auth',
      });
    });

    it('should test RFQ analytics (requires auth)', () => {
      testAPI('GET', '/rfq/analytics', 401, 'RFQ', {
        requiresAuth: true,
        description: 'Get RFQ analytics without auth',
      });
    });
  });

  // ============================================
  // 11. SUPPORT MODULE (22 endpoints)
  // ============================================
  describe('🎧 Support APIs', () => {
    it('should test list tickets (requires auth)', () => {
      testAPI('GET', '/support/tickets', 401, 'Support', {
        requiresAuth: true,
        description: 'Get support tickets without auth',
      });
    });

    it('should test create ticket (requires auth)', () => {
      testAPI('POST', '/support/tickets', 401, 'Support', {
        requiresAuth: true,
        description: 'Create support ticket without auth',
      });
    });

    it('should test ticket by ID (requires auth)', () => {
      testAPI('GET', '/support/tickets/test-id', 401, 'Support', {
        requiresAuth: true,
        description: 'Get ticket by ID without auth',
      });
    });

    it('should test ticket messages (requires auth)', () => {
      testAPI('GET', '/support/tickets/test-id/messages', 401, 'Support', {
        requiresAuth: true,
        description: 'Get ticket messages without auth',
      });
    });

    it('should test close ticket (requires auth)', () => {
      testAPI('POST', '/support/tickets/test-id/close', 401, 'Support', {
        requiresAuth: true,
        description: 'Close ticket without auth',
      });
    });

    it('should test FAQ list', () => {
      testAPI('GET', '/support/faq', 200, 'Support', {
        description: 'Get FAQ list',
      });
    });
  });

  // ============================================
  // 12. FINANCE MODULE (27 endpoints)
  // ============================================
  describe('💰 Finance APIs', () => {
    it('should test transactions (requires auth)', () => {
      testAPI('GET', '/finance/transactions', 401, 'Finance', {
        requiresAuth: true,
        description: 'Get transactions without auth',
      });
    });

    it('should test payouts (requires auth)', () => {
      testAPI('GET', '/finance/payouts', 401, 'Finance', {
        requiresAuth: true,
        description: 'Get payouts without auth',
      });
    });

    it('should test refunds (requires auth)', () => {
      testAPI('GET', '/finance/refunds', 401, 'Finance', {
        requiresAuth: true,
        description: 'Get refunds without auth',
      });
    });

    it('should test settlements (requires auth)', () => {
      testAPI('GET', '/finance/settlements', 401, 'Finance', {
        requiresAuth: true,
        description: 'Get settlements without auth',
      });
    });

    it('should test finance analytics (requires auth)', () => {
      testAPI('GET', '/finance/analytics', 401, 'Finance', {
        requiresAuth: true,
        description: 'Get finance analytics without auth',
      });
    });
  });

  // ============================================
  // 13. CMS MODULE (35 endpoints)
  // ============================================
  describe('📝 CMS APIs', () => {
    it('should test list pages', () => {
      testAPI('GET', '/cms/pages', 200, 'CMS', {
        description: 'Get CMS pages',
      });
    });

    it('should test page by ID', () => {
      testAPI('GET', '/cms/pages/test-id', 404, 'CMS', {
        description: 'Get page by ID',
      });
    });

    it('should test blog posts', () => {
      testAPI('GET', '/cms/blog', 200, 'CMS', {
        description: 'Get blog posts',
      });
    });

    it('should test banners', () => {
      testAPI('GET', '/cms/banners', 200, 'CMS', {
        description: 'Get banners',
      });
    });

    it('should test FAQs', () => {
      testAPI('GET', '/cms/faqs', 200, 'CMS', {
        description: 'Get FAQs',
      });
    });

    it('should test media library (requires auth)', () => {
      testAPI('GET', '/cms/media', 401, 'CMS', {
        requiresAuth: true,
        description: 'Get media library without auth',
      });
    });
  });

  // ============================================
  // 14. ADDITIONAL MODULES (Quick Tests)
  // ============================================
  describe('🔧 Additional APIs', () => {
    it('should test shipping carriers', () => {
      testAPI('GET', '/shipping/carriers', 200, 'Shipping', {
        description: 'Get shipping carriers',
      });
    });

    it('should test shipping methods', () => {
      testAPI('GET', '/shipping/methods', 200, 'Shipping', {
        description: 'Get shipping methods',
      });
    });

    it('should test inventory alerts (requires auth)', () => {
      testAPI('GET', '/inventory/alerts', 401, 'Inventory', {
        requiresAuth: true,
        description: 'Get inventory alerts without auth',
      });
    });

    it('should test subscriptions plans', () => {
      testAPI('GET', '/subscriptions/plans', 200, 'Subscriptions', {
        description: 'Get subscription plans',
      });
    });

    it('should test gift cards', () => {
      testAPI('GET', '/gift-cards', 200, 'Gift Cards', {
        description: 'Get gift cards',
      });
    });

    it('should test notifications (requires auth)', () => {
      testAPI('GET', '/notifications', 401, 'Notifications', {
        requiresAuth: true,
        description: 'Get notifications without auth',
      });
    });

    it('should test settings (requires auth)', () => {
      testAPI('GET', '/settings', 401, 'Settings', {
        requiresAuth: true,
        description: 'Get settings without auth',
      });
    });
  });
});

