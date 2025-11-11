/**
 * API Endpoints Configuration
 * 
 * This file centralizes all API endpoints used throughout the frontend.
 * Import specific endpoint groups or individual endpoints as needed.
 * 
 * Usage:
 * import { AUTH_ENDPOINTS, DEALS_ENDPOINTS } from '@/config/api-endpoints';
 * import { API_ENDPOINTS } from '@/config/api-endpoints';
 * 
 * const response = await api.get(AUTH_ENDPOINTS.LOGIN);
 * const deals = await api.get(DEALS_ENDPOINTS.GET_ALL);
 */

// Authentication & Users
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  PROFILE: '/auth/profile',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
} as const;

// Admin Endpoints
export const ADMIN_ENDPOINTS = {
  AFFILIATES: {
    GET_ALL: '/admin/affiliates',
    COMMISSIONS: '/admin/affiliates/commissions',
    PAYOUTS: '/admin/affiliates/payouts',
    PROCESS_PAYOUTS: '/admin/affiliates/payouts/process',
    PROGRAMS: '/admin/affiliates/programs',
    STATS: '/admin/affiliates/stats',
  },
  SECURITY: {
    CONFIGURATION: '/admin/security/configuration',
    EVENTS: '/admin/security/events',
    EXPORT_EVENTS: '/admin/security/events/export',
    METRICS: '/admin/security/metrics',
    SCAN: '/admin/security/scan',
    THREATS: '/admin/security/threats',
    EXPORT_THREATS: '/admin/security/threats/export',
  },
} as const;

// Core Products
export const PRODUCT_ENDPOINTS = {
  GET_ALL: '/products',
  GET_BY_ID: (id: string) => `/products/${id}`,
  CREATE: '/products',
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
  SEARCH: '/products/search',
  TRENDING: '/products/trending',
  FEATURED: '/products/featured',
  BESTSELLERS: '/products/bestsellers',
  COMPARE: '/products/compare',
  EXPORT: '/products/export',
  RECOMMENDATIONS: '/products/recommended',
  BY_VENDOR: (vendorId: string) => `/products/vendor/${vendorId}`,
  BY_SLUG: (slug: string) => `/products/slug/${slug}`,
  UPDATE_STATUS: (id: string) => `/products/${id}/status`,
  UPDATE_STOCK: (id: string) => `/products/${id}/stock`,
} as const;

// API Legacy Product Endpoints (with /api prefix)
export const API_PRODUCT_ENDPOINTS = {
  GET_ALL: '/api/products',
  SEARCH: '/api/products/search',
  FEATURED: '/api/products/featured',
  COMPARE: '/api/products/compare',
  SUGGESTIONS: '/api/products/suggestions',
} as const;

// Orders
export const ORDER_ENDPOINTS = {
  GET_ALL: '/orders',
  GET_BY_ID: (id: string) => `/orders/${id}`,
  GET_BY_NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
  CREATE: '/orders',
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
  UPDATE_TRACKING: (id: string) => `/orders/${id}/tracking`,
  GET_CUSTOMER_ORDERS: (customerId: string) => `/customers/${customerId}/orders`,
  GET_VENDOR_ORDERS: (vendorId: string) => `/vendors/${vendorId}/orders`,
  TRACK: (trackingNumber: string) => `/orders/track/${trackingNumber}`,
  REFUND: (id: string) => `/orders/${id}/refund`,
  EXPORT: '/orders/export',
} as const;

// Advanced Orders
export const ADVANCED_ORDER_ENDPOINTS = {
  GET_ALL: '/orders/advanced',
  GET_BY_ID: (orderId: string) => `/orders/advanced/${orderId}`,
  UPDATE: (orderId: string) => `/orders/advanced/${orderId}`,
  UPDATE_STATUS: (orderId: string) => `/orders/advanced/${orderId}/status`,
  ASSIGN: (orderId: string) => `/orders/advanced/${orderId}/assign`,
  ESCALATE: (orderId: string) => `/orders/advanced/${orderId}/escalate`,
  CAN_SPLIT: (orderId: string) => `/orders/advanced/${orderId}/can-split`,
  SPLIT: (orderId: string) => `/orders/advanced/${orderId}/split`,
  GET_SPLITS: (orderId: string) => `/orders/advanced/${orderId}/splits`,
  MERGE_SPLITS: (parentOrderId: string) => `/orders/advanced/${parentOrderId}/merge-splits`,
  TIMELINE: (orderId: string) => `/orders/advanced/${orderId}/timeline`,
  ADD_EVENT: (orderId: string) => `/orders/advanced/${orderId}/events`,
  UPDATE_EVENT: (orderId: string, eventId: string) => `/orders/advanced/${orderId}/events/${eventId}`,
  GET_NOTES: (orderId: string) => `/orders/advanced/${orderId}/notes`,
  ADD_NOTE: (orderId: string) => `/orders/advanced/${orderId}/notes`,
  UPDATE_NOTE: (orderId: string, noteId: string) => `/orders/advanced/${orderId}/notes/${noteId}`,
  DELETE_NOTE: (orderId: string, noteId: string) => `/orders/advanced/${orderId}/notes/${noteId}`,
  ADD_TAGS: (orderId: string) => `/orders/advanced/${orderId}/tags`,
  REMOVE_TAGS: (orderId: string) => `/orders/advanced/${orderId}/tags`,
  UPDATE_TRACKING: (orderId: string) => `/orders/advanced/${orderId}/tracking`,
  ADD_TRACKING_EVENT: (orderId: string) => `/orders/advanced/${orderId}/tracking/events`,
  UPDATE_FULFILLMENT: (orderId: string) => `/orders/advanced/${orderId}/fulfillment`,
  GENERATE_SHIPPING_LABEL: (orderId: string) => `/orders/advanced/${orderId}/shipping-label`,
  GENERATE_PACKING_SLIP: (orderId: string) => `/orders/advanced/${orderId}/packing-slip`,
  WORKFLOW_TEMPLATES: '/orders/workflow-templates',
  CREATE_TEMPLATE: '/orders/workflow-templates',
  UPDATE_TEMPLATE: (templateId: string) => `/orders/workflow-templates/${templateId}`,
  DELETE_TEMPLATE: (templateId: string) => `/orders/workflow-templates/${templateId}`,
  APPLY_WORKFLOW: (orderId: string) => `/orders/advanced/${orderId}/apply-workflow`,
  CREATE_BATCH: '/orders/batches',
  GET_BATCHES: '/orders/batches',
  GET_BATCH: (batchId: string) => `/orders/batches/${batchId}`,
  PROCESS_BATCH: (batchId: string) => `/orders/batches/${batchId}/process`,
  BULK_UPDATE_STATUS: '/orders/batch/status',
  BULK_ASSIGN: '/orders/batch/assign',
  BULK_UPDATE_TAGS: '/orders/batch/tags',
  BULK_EXPORT: '/orders/batch/export',
  STATS: '/orders/stats',
  PERFORMANCE: '/orders/performance',
  TRENDS: '/orders/trends',
  FULFILLMENT_ANALYTICS: '/orders/fulfillment-analytics',
  SEARCH: '/orders/search',
  FILTER_OPTIONS: '/orders/filter-options',
  AUTOMATION_RULES: '/orders/automation-rules',
  CREATE_AUTOMATION_RULE: '/orders/automation-rules',
  UPDATE_AUTOMATION_RULE: (ruleId: string) => `/orders/automation-rules/${ruleId}`,
  DELETE_AUTOMATION_RULE: (ruleId: string) => `/orders/automation-rules/${ruleId}`,
  TEST_AUTOMATION_RULE: (ruleId: string) => `/orders/automation-rules/${ruleId}/test`,
  SEND_EMAIL: (orderId: string) => `/orders/advanced/${orderId}/email`,
  SEND_SMS: (orderId: string) => `/orders/advanced/${orderId}/sms`,
  GET_COMMUNICATIONS: (orderId: string) => `/orders/advanced/${orderId}/communications`,
  PREDICT_DELIVERY: (orderId: string) => `/orders/advanced/${orderId}/predict-delivery`,
  OPTIMIZE_ROUTING: '/orders/optimize-routing',
  GET_ANOMALIES: (orderId: string) => `/orders/advanced/${orderId}/anomalies`,
  GET_RECOMMENDATIONS: (orderId: string) => `/orders/advanced/${orderId}/recommendations`,
} as const;

// Marketing - Deals
export const DEALS_ENDPOINTS = {
  GET_ALL: '/deals',
  GET_BY_ID: (id: string) => `/deals/${id}`,
  CREATE: '/deals',
  UPDATE: (id: string) => `/deals/${id}`,
  DELETE: (id: string) => `/deals/${id}`,
  STATS: '/deals/stats',
  ANALYTICS: (id: string) => `/deals/${id}/analytics`,
  USAGE: (dealId: string) => `/deals/${dealId}/usage`,
  TOGGLE_STATUS: (id: string) => `/deals/${id}/toggle-status`,
  DUPLICATE: (id: string) => `/deals/${id}/duplicate`,
  ACTIVE: '/deals/active',
  CHECK_ELIGIBILITY: (dealId: string) => `/deals/${dealId}/check-eligibility`,
  APPLY: (dealId: string) => `/deals/${dealId}/apply`,
  TRACK_CLICK: (dealId: string) => `/deals/${dealId}/track-click`,
  BEST_FOR_USER: (userId: string) => `/deals/best-for-user/${userId}`,
  BULK_DELETE: '/deals/bulk-delete',
  BULK_UPDATE_STATUS: '/deals/bulk-update-status',
  UPLOAD_BANNER: (dealId: string) => `/deals/${dealId}/upload-banner`,
  PERFORMANCE_REPORT: '/deals/performance-report',
  TRENDING: '/deals/trending',
} as const;

// Marketing - Coupons
export const COUPON_ENDPOINTS = {
  GET_ALL: '/coupons',
  GET_BY_ID: (id: string) => `/coupons/${id}`,
  CREATE: '/coupons',
  UPDATE: (id: string) => `/coupons/${id}`,
  DELETE: (id: string) => `/coupons/${id}`,
  STATS: '/coupons/stats',
  APPLY: '/coupons/apply',
  VALIDATE: '/coupons/validate',
} as const;

// Marketing - Promotions
export const PROMOTION_ENDPOINTS = {
  GET_ALL: '/promotions',
  GET_BY_ID: (id: string) => `/promotions/${id}`,
  CREATE: '/promotions',
  UPDATE: (id: string) => `/promotions/${id}`,
  DELETE: (id: string) => `/promotions/${id}`,
  STATS: '/promotions/stats',
  CALENDAR: '/promotions/calendar',
  RECOMMENDATIONS: '/promotions/recommendations',
  TEMPLATES: '/promotions/templates',
} as const;

// Flash Sales
export const FLASH_SALE_ENDPOINTS = {
  GET_ALL: '/flash-sales',
  GET_BY_ID: (id: string) => `/flash-sales/${id}`,
  CREATE: '/flash-sales',
  UPDATE: (id: string) => `/flash-sales/${id}`,
  DELETE: (id: string) => `/flash-sales/${id}`,
  START: (id: string) => `/flash-sales/${id}/start`,
  END: (id: string) => `/flash-sales/${id}/end`,
  CANCEL: (id: string) => `/flash-sales/${id}/cancel`,
  EXTEND: (id: string) => `/flash-sales/${id}/extend`,
  DUPLICATE: (id: string) => `/flash-sales/${id}/duplicate`,
  ADD_PRODUCTS: (saleId: string) => `/flash-sales/${saleId}/products`,
  REMOVE_PRODUCT: (saleId: string, productId: string) => `/flash-sales/${saleId}/products/${productId}`,
  UPDATE_PRICE: (saleId: string, productId: string) => `/flash-sales/${saleId}/products/${productId}/price`,
  UPDATE_INVENTORY: (saleId: string, productId: string) => `/flash-sales/${saleId}/products/${productId}/inventory`,
  DAILY_DEALS: '/daily-deals',
  CREATE_DAILY_DEAL: '/daily-deals',
  UPDATE_DAILY_DEAL: (id: string) => `/daily-deals/${id}`,
  DELETE_DAILY_DEAL: (id: string) => `/daily-deals/${id}`,
  TEMPLATES: '/flash-sales/templates',
  CREATE_TEMPLATE: '/flash-sales/templates',
  UPDATE_TEMPLATE: (id: string) => `/flash-sales/templates/${id}`,
  DELETE_TEMPLATE: (id: string) => `/flash-sales/templates/${id}`,
  APPLY_TEMPLATE: (templateId: string) => `/flash-sales/templates/${templateId}/apply`,
  STATS: '/flash-sales/stats',
  ANALYTICS: (saleId: string) => `/flash-sales/${saleId}/analytics`,
  PERFORMANCE: (saleId: string) => `/flash-sales/${saleId}/performance`,
  ACTIVITY: '/flash-sales/activity',
  NOTIFY: (saleId: string) => `/flash-sales/${saleId}/notify`,
  SUBSCRIBERS: (saleId: string) => `/flash-sales/${saleId}/subscribers`,
  BULK_START: '/flash-sales/bulk/start',
  BULK_END: '/flash-sales/bulk/end',
  BULK_CANCEL: '/flash-sales/bulk/cancel',
  BULK_DELETE: '/flash-sales/bulk/delete',
  SEARCH: '/flash-sales/search',
  SUGGESTIONS: '/flash-sales/suggestions',
  EXPORT: '/flash-sales/export',
  IMPORT: '/flash-sales/import',
  LIVE: '/flash-sales/live',
  UPCOMING: '/flash-sales/upcoming',
  COUNTDOWN: (saleId: string) => `/flash-sales/${saleId}/countdown`,
} as const;

// Reports & Analytics
export const REPORT_ENDPOINTS = {
  DASHBOARD: '/reports/dashboard',
  RECENT_ACTIVITIES: '/reports/recent-activities',
  SYSTEM_HEALTH: '/reports/system-health',
  SALES: '/reports/sales',
  PRODUCTS: '/reports/products',
  CUSTOMERS: '/reports/customers',
  VENDORS: '/reports/vendors',
  RFQ: '/reports/rfq',
  SUBSCRIPTIONS: '/reports/subscriptions',
  CATEGORIES: '/reports/categories',
  BACKEND_SALES: '/reports/sales',
  BACKEND_PRODUCTS: '/reports/products',
  BACKEND_CUSTOMERS: '/reports/customers',
  BACKEND_VENDORS: '/reports/vendors',
  BACKEND_RFQ: '/reports/rfq',
  BACKEND_SUBSCRIPTIONS: '/reports/subscriptions',
  BACKEND_CATEGORIES: '/reports/categories',
  BACKEND_DASHBOARD: '/reports/dashboard',
  BACKEND_RECENT_ACTIVITIES: '/reports/recent-activities',
  BACKEND_SYSTEM_HEALTH: '/reports/system-health',
} as const;

// Backend Support
export const BACKEND_SUPPORT_ENDPOINTS = {
  GET_TICKETS: '/support/tickets',
  GET_MY_TICKETS: '/support/tickets/my',
  GET_ASSIGNED_TICKETS: '/support/tickets/assigned',
  CREATE_TICKET: '/support/tickets',
  GET_TICKET: (id: string) => `/support/tickets/${id}`,
  ASSIGN_TICKET: (id: string) => `/support/tickets/${id}/assign`,
  UPDATE_STATUS: (id: string) => `/support/tickets/${id}/status`,
  ESCALATE: (id: string) => `/support/tickets/${id}/escalate`,
  ADD_MESSAGE: (id: string) => `/support/tickets/${id}/messages`,
  GET_MESSAGES: (id: string) => `/support/tickets/${id}/messages`,
  ADD_FEEDBACK: (id: string) => `/support/tickets/${id}/feedback`,
  ANALYTICS_OVERVIEW: '/support/analytics/overview',
  ANALYTICS_PERFORMANCE: '/support/analytics/performance',
  GET_CATEGORIES: '/support/categories/list',
  GET_TEMPLATES: '/support/templates/list',
  CREATE_TEMPLATE: '/support/templates',
  GET_KB_ARTICLES: '/support/knowledge-base/articles',
  CREATE_KB_ARTICLE: '/support/knowledge-base/articles',
  GET_FAQ: '/support/faq',
  INITIATE_CHAT: '/support/chat/initiate',
  DASHBOARD_STATS: '/support/dashboard/stats',
  SLA_REPORTS: '/support/reports/sla',
} as const;

// Backend Upload
export const BACKEND_UPLOAD_ENDPOINTS = {
  SINGLE: '/upload/single',
  MULTIPLE: '/upload/multiple',
  GET_BY_ENTITY: (entityType: string, entityId: string) => `/upload/entity/${entityType}/${entityId}`,
  GET_MY_UPLOADS: '/upload/my-uploads',
  DELETE: (id: string) => `/upload/${id}`,
} as const;

// Backend RFQ
export const BACKEND_RFQ_ENDPOINTS = {
  CREATE: '/rfq',
  GET_ALL: '/rfq',
  GET_MY_RFQS: '/rfq/my-rfqs',
  GET_BY_ID: (id: string) => `/rfq/${id}`,
  UPDATE_STATUS: (id: string) => `/rfq/${id}/status`,
  GET_QUOTATIONS: (id: string) => `/rfq/${id}/quotations`,
  CREATE_QUOTATION: '/rfq/quotations',
  GET_MY_QUOTATIONS: '/rfq/quotations/my-quotations',
  ACCEPT_QUOTATION: (id: string) => `/rfq/quotations/${id}/accept`,
} as const;

// Backend Payment & Finance
export const BACKEND_PAYMENT_ENDPOINTS = {
  INITIATE: '/payment/initiate',
  VERIFY: (id: string) => `/payment/${id}/verify`,
  HISTORY: '/payment/history',
  MY_PAYMENTS: '/payment/my-payments',
  WALLET_BALANCE: '/payment/wallet/balance',
  WALLET_TRANSACTIONS: '/payment/wallet/transactions',
  WALLET_CREDIT: '/payment/wallet/credit',
} as const;

export const BACKEND_FINANCE_ENDPOINTS = {
  GET_TRANSACTIONS: '/finance/transactions',
  TRANSACTION_STATS: '/finance/transactions/stats',
  GET_PAYOUTS: '/finance/payouts',
  PROCESS_PAYOUT: (vendorId: string) => `/finance/payouts/${vendorId}/process`,
  PENDING_PAYOUTS: '/finance/payouts/pending',
  VENDOR_EARNINGS: (vendorId: string) => `/finance/vendor/${vendorId}/earnings`,
  GET_REFUNDS: '/finance/refunds',
  PROCESS_REFUND: (orderId: string) => `/finance/refunds/${orderId}/process`,
  PENDING_REFUNDS: '/finance/refunds/pending',
  DASHBOARD: '/finance/dashboard',
  RECONCILIATION: '/finance/reconciliation',
  SETTLEMENTS: '/finance/settlements',
} as const;

// Backend Admin
export const BACKEND_ADMIN_ENDPOINTS = {
  GET_USERS: '/users',
  GET_STATS: '/users/stats',
} as const;

// Bootstrap & Seed
export const BACKEND_BOOTSTRAP_ENDPOINTS = {
  BOOTSTRAP: '/bootstrap',
  SEED: '/seed',
  HEALTH_SEED: '/health/seed',
} as const;

// Inventory Alerts
export const INVENTORY_ENDPOINTS = {
  ALERTS: '/inventory/alerts',
  ALERT_BY_ID: (id: string) => `/inventory/alerts/${id}`,
  ACKNOWLEDGE_ALERT: (id: string) => `/inventory/alerts/${id}/acknowledge`,
  RESOLVE_ALERT: (id: string) => `/inventory/alerts/${id}/resolve`,
  DISMISS_ALERT: (id: string) => `/inventory/alerts/${id}/dismiss`,
  UPDATE_SEVERITY: (id: string) => `/inventory/alerts/${id}/severity`,
  ALERT_RULES: '/inventory/alert-rules',
  ALERT_RULE_BY_ID: (id: string) => `/inventory/alert-rules/${id}`,
  CREATE_ALERT_RULE: '/inventory/alert-rules',
  UPDATE_ALERT_RULE: (id: string) => `/inventory/alert-rules/${id}`,
  DELETE_ALERT_RULE: (id: string) => `/inventory/alert-rules/${id}`,
  TOGGLE_RULE: (id: string) => `/inventory/alert-rules/${id}/toggle`,
  TEST_RULE: (id: string) => `/inventory/alert-rules/${id}/test`,
  THRESHOLDS: '/inventory/thresholds',
  THRESHOLD_BY_PRODUCT: (productId: string) => `/inventory/thresholds/${productId}`,
  CREATE_THRESHOLD: '/inventory/thresholds',
  UPDATE_THRESHOLD: (productId: string) => `/inventory/thresholds/${productId}`,
  DELETE_THRESHOLD: (productId: string) => `/inventory/thresholds/${productId}`,
  BULK_UPDATE_THRESHOLDS: '/inventory/thresholds/bulk-update',
  NOTIFICATION_CHANNELS: '/inventory/notification-channels',
  CREATE_CHANNEL: '/inventory/notification-channels',
  UPDATE_CHANNEL: (id: string) => `/inventory/notification-channels/${id}`,
  DELETE_CHANNEL: (id: string) => `/inventory/notification-channels/${id}`,
  TEST_CHANNEL: (id: string) => `/inventory/notification-channels/${id}/test`,
  SET_DEFAULT_CHANNEL: (id: string) => `/inventory/notification-channels/${id}/set-default`,
  ALERT_STATS: '/inventory/alerts/stats',
  ALERT_TRENDS: '/inventory/alerts/trends',
  TOP_PRODUCTS: '/inventory/alerts/top-products',
  BULK_ACTION: '/inventory/alerts/bulk-action',
  BULK_ACKNOWLEDGE: '/inventory/alerts/bulk-acknowledge',
  BULK_RESOLVE: '/inventory/alerts/bulk-resolve',
  CHECK_NOW: '/inventory/alerts/check-now',
  REALTIME_ALERTS: '/inventory/alerts/realtime',
  EXPORT_ALERTS: '/inventory/alerts/export',
  GENERATE_REPORT: '/inventory/alerts/reports',
  THRESHOLD_SUGGESTIONS: (productId: string) => `/inventory/alerts/threshold-suggestions/${productId}`,
  OPTIMIZATION_SUGGESTIONS: '/inventory/alerts/optimization-suggestions',
  SETTINGS: '/inventory/alerts/settings',
  UPDATE_SETTINGS: '/inventory/alerts/settings',
} as const;

// Returns & Refunds
export const RETURN_ENDPOINTS = {
  GET_ALL: '/returns',
  GET_BY_ID: (id: string) => `/returns/${id}`,
  GET_BY_RMA: (rmaNumber: string) => `/returns/rma/${rmaNumber}`,
  CREATE: '/returns',
  UPDATE: (id: string) => `/returns/${id}`,
  DELETE: (id: string) => `/returns/${id}`,
  APPROVE: (id: string) => `/returns/${id}/approve`,
  REJECT: (id: string) => `/returns/${id}/reject`,
  RECEIVED: (id: string) => `/returns/${id}/received`,
  INSPECT: (id: string) => `/returns/${id}/inspect`,
  COMPLETE: (id: string) => `/returns/${id}/complete`,
  CANCEL: (id: string) => `/returns/${id}/cancel`,
  TIMELINE: (returnId: string) => `/returns/${returnId}/timeline`,
  STATS: '/returns/stats',
  CUSTOMER_RETURNS: (customerId: string) => `/returns/customer/${customerId}`,
  BULK_APPROVE: '/returns/bulk/approve',
  BULK_REJECT: '/returns/bulk/reject',
  BULK_DELETE: '/returns/bulk',
  GET_LABEL: (returnId: string) => `/returns/${returnId}/label`,
  EXPORT: '/returns/export',
  SEARCH: '/returns/search',
} as const;

// Digital Products
export const DIGITAL_PRODUCT_ENDPOINTS = {
  GET_ALL: '/customer/digital-products',
  GET_BY_ID: (id: string) => `/customer/digital-products/${id}`,
  GET_ORDER_PRODUCTS: (orderId: string) => `/customer/orders/${orderId}/digital-products`,
  DOWNLOAD: '/customer/digital-products/download',
  DOWNLOAD_HISTORY: '/customer/digital-products/download-history',
  STATS: '/customer/digital-products/stats',
  VERIFY_LICENSE: '/customer/digital-products/verify-license',
  ACTIVATE_LICENSE: '/customer/digital-products/activate-license',
  DEACTIVATE_LICENSE: '/customer/digital-products/deactivate-license',
  GET_ACTIVATIONS: (productId: string) => `/customer/digital-products/${productId}/activations`,
  GET_UPDATES: '/customer/digital-products/updates',
  UPDATE_PRODUCT: (productId: string) => `/customer/digital-products/${productId}/update`,
  CONTACT_SUPPORT: (productId: string) => `/customer/digital-products/${productId}/support`,
  REPORT_ISSUE: (productId: string) => `/customer/digital-products/${productId}/report-issue`,
  GET_DOCUMENTATION: (productId: string) => `/customer/digital-products/${productId}/documentation`,
  GET_CHANGELOG: (productId: string) => `/customer/digital-products/${productId}/changelog`,
  RESEND_LICENSE: (productId: string) => `/customer/digital-products/${productId}/resend-license`,
  GET_BY_LICENSE: (licenseKey: string) => `/customer/digital-products/by-license/${licenseKey}`,
  REFRESH_LINK: (productId: string) => `/customer/digital-products/${productId}/refresh-link`,
} as const;

// Subscriptions
export const SUBSCRIPTION_ENDPOINTS = {
  GET_ALL: '/api/subscriptions',
  GET_BY_ID: (id: string) => `/api/subscriptions/${id}`,
  CREATE: '/api/subscriptions',
  UPDATE: (id: string) => `/api/subscriptions/${id}`,
  PAUSE: (id: string) => `/api/subscriptions/${id}/pause`,
  RESUME: (id: string) => `/api/subscriptions/${id}/resume`,
  CANCEL: (id: string) => `/api/subscriptions/${id}/cancel`,
  GET_PLANS: (productId: string) => `/api/products/${productId}/subscription-plans`,
  BILLING_HISTORY: (subscriptionId: string) => `/api/subscriptions/${subscriptionId}/billing-history`,
  STATS: '/api/subscriptions/stats',
  GET_INVOICE: (billingId: string) => `/api/billing/${billingId}/invoice`,
  UPDATE_PAYMENT_METHOD: (subscriptionId: string) => `/api/subscriptions/${subscriptionId}/payment-method`,
  UPCOMING_RENEWALS: '/api/subscriptions/upcoming-renewals',
} as const;

// Affiliate System
export const AFFILIATE_ENDPOINTS = {
  PROGRAMS: '/affiliate/programs',
  PROGRAM_BY_ID: (id: string) => `/affiliate/programs/${id}`,
  APPLY: '/affiliate/apply',
  DASHBOARD: '/affiliate/dashboard',
  ACTIVITY: '/affiliate/activity',
  EXPORT_ACTIVITY: '/affiliate/activity/export',
  COMMISSIONS: '/affiliate/commissions',
  EXPORT_COMMISSIONS: '/affiliate/commissions/export',
  EARNINGS_STATS: '/affiliate/earnings/stats',
  LINKS: '/affiliate/links',
  PAYOUTS: '/affiliate/payouts',
  REQUEST_PAYOUT: '/affiliate/payouts/request',
  PROFILE: '/affiliate/profile',
  REFERRALS: '/affiliate/referrals',
} as const;

// Analytics & Reporting
export const ANALYTICS_ENDPOINTS = {
  DASHBOARD: '/analytics/dashboard',
  OVERVIEW: '/analytics/overview',
  REALTIME: '/analytics/realtime',
  ATTRIBUTION: '/analytics/attribution',
  CONFIG: '/analytics/config',
  CUSTOMERS: '/analytics/customers',
  CUSTOMER_RETENTION: '/analytics/customers/retention',
  CUSTOMER_SEGMENTATION: '/analytics/customers/segmentation',
  DEVICES: '/analytics/devices',
  EVENTS: '/analytics/events',
  GEOGRAPHIC: '/analytics/geographic',
  IMPORT: '/analytics/import',
  PRODUCTS: '/analytics/products',
  PRODUCT_TRENDS: '/analytics/products/trends',
  REPORTS: '/analytics/reports',
  GENERATE_REPORTS: '/analytics/reports/generate',
  SCHEDULE_REPORTS: '/analytics/reports/schedule',
  REVENUE: '/analytics/revenue',
  SALES_COMPARISON: '/analytics/sales/comparison',
  SALES_FORECAST: '/analytics/sales/forecast',
  SALES_METRICS: '/analytics/sales/metrics',
  TRAFFIC: '/analytics/traffic',
} as const;

// Categories & Brands
export const CATEGORY_ENDPOINTS = {
  GET_ALL: '/categories',
  TREE: '/categories/tree',
  BACKEND_GET_ALL: '/categories',
  BACKEND_GET_BY_ID: (id: string) => `/categories/${id}`,
  BACKEND_CREATE: '/categories',
  BACKEND_UPDATE: (id: string) => `/categories/${id}`,
  BACKEND_DELETE: (id: string) => `/categories/${id}`,
  BACKEND_HIERARCHY: '/categories/hierarchy',
  BACKEND_SUBCATEGORIES: (id: string) => `/categories/${id}/subcategories`,
  BACKEND_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
} as const;

export const BRAND_ENDPOINTS = {
  GET_ALL: '/brands',
  POPULAR: '/brands/popular',
  BACKEND_GET_ALL: '/brands',
  BACKEND_GET_BY_ID: (id: string) => `/brands/${id}`,
  BACKEND_CREATE: '/brands',
  BACKEND_UPDATE: (id: string) => `/brands/${id}`,
  BACKEND_DELETE: (id: string) => `/brands/${id}`,
  BACKEND_BY_SLUG: (slug: string) => `/brands/slug/${slug}`,
} as const;

// Backend CMS Endpoints
export const BACKEND_CMS_ENDPOINTS = {
  BANNERS: {
    GET_ALL: '/cms/banners',
    GET_ACTIVE: '/cms/banners/active',
    CREATE: '/cms/banners',
    UPDATE: (id: string) => `/cms/banners/${id}`,
    DELETE: (id: string) => `/cms/banners/${id}`,
  },
  FAQS: {
    GET_ALL: '/cms/faqs',
    GET_ACTIVE: '/cms/faqs/active',
    CREATE: '/cms/faqs',
    UPDATE: (id: string) => `/cms/faqs/${id}`,
    DELETE: (id: string) => `/cms/faqs/${id}`,
  },
  PAGES: {
    GET_ALL: '/cms/pages',
    CREATE: '/cms/pages',
    GET_BY_SLUG: (slug: string) => `/cms/pages/${slug}`,
    UPDATE: (id: string) => `/cms/pages/${id}`,
    DELETE: (id: string) => `/cms/pages/${id}`,
  },
} as const;

// Backend Orders
export const BACKEND_ORDER_ENDPOINTS = {
  CREATE: '/orders',
  GET_ALL: '/orders',
  GET_MY_ORDERS: '/orders/my-orders',
  GET_STATS: '/orders/stats',
  GET_BY_STATUS: (status: string) => `/orders/status/${status}`,
  GET_BY_ID: (id: string) => `/orders/${id}`,
  GET_BY_NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
  GET_MANIFESTED: '/orders/manifested',
  GET_DISPUTED: '/orders/disputed',
  GET_CANCELLED: '/orders/cancelled',
  GET_HOLD: '/orders/hold',
  GET_RETURNS: '/orders/returns',
  MANIFEST: (id: string) => `/orders/${id}/manifest`,
  SHIP: (id: string) => `/orders/${id}/ship`,
  HOLD: (id: string) => `/orders/${id}/hold`,
  DISPUTE: (id: string) => `/orders/${id}/dispute`,
  RETURN: (id: string) => `/orders/${id}/return`,
  REFUND: (id: string) => `/orders/${id}/refund`,
  TRACKING: (id: string) => `/orders/${id}/tracking`,
  ANALYTICS: '/orders/analytics',
} as const;

// Backend Marketing
export const BACKEND_DEALS_ENDPOINTS = {
  GET_ALL: '/deals',
  GET_STATS: '/deals/stats',
  GET_ACTIVE: '/deals/active',
  GET_PERFORMANCE: '/deals/performance-report',
  GET_TRENDING: '/deals/trending',
  GET_BEST_FOR_USER: (userId: string) => `/deals/best-for-user/${userId}`,
  GET_BY_ID: (id: string) => `/deals/${id}`,
  GET_ANALYTICS: (id: string) => `/deals/${id}/analytics`,
  GET_USAGE: (dealId: string) => `/deals/${dealId}/usage`,
  CREATE: '/deals',
  UPDATE: (id: string) => `/deals/${id}`,
  DELETE: (id: string) => `/deals/${id}`,
  TOGGLE_STATUS: (id: string) => `/deals/${id}/toggle-status`,
  DUPLICATE: (id: string) => `/deals/${id}/duplicate`,
  CHECK_ELIGIBILITY: (dealId: string) => `/deals/${dealId}/check-eligibility`,
  APPLY: (dealId: string) => `/deals/${dealId}/apply`,
  TRACK_CLICK: (dealId: string) => `/deals/${dealId}/track-click`,
  UPLOAD_BANNER: (dealId: string) => `/deals/${dealId}/upload-banner`,
  BULK_DELETE: '/deals/bulk-delete',
  BULK_UPDATE_STATUS: '/deals/bulk-update-status',
} as const;

export const BACKEND_COUPON_ENDPOINTS = {
  GET_STATS: '/coupons/stats',
} as const;

export const BACKEND_PROMOTION_ENDPOINTS = {
  GET_STATS: '/promotions/stats',
} as const;

export const API_BRAND_ENDPOINTS = {
  GET_ALL: '/api/brands',
  POPULAR: '/api/brands/popular',
  SEARCH: '/api/brands/search',
} as const;

export const API_CATEGORY_ENDPOINTS = {
  GET_ALL: '/api/categories',
  POPULAR: '/api/categories/popular',
  PERFORMANCE: '/api/categories/performance',
} as const;

// Shopping Cart (Backend)
export const CART_ENDPOINTS = {
  GET: '/cart',
  ITEMS: '/cart/items',
  COUNT: '/cart/count',
  COUPON: '/cart/coupon',
  BACKEND_GET: '/cart',
  BACKEND_ADD: '/cart',
  BACKEND_UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
  BACKEND_REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
  BACKEND_CLEAR: '/cart',
  BACKEND_WISHLIST: '/cart/wishlist',
  BACKEND_GET_WISHLIST: '/cart/wishlist',
  BACKEND_REMOVE_FROM_WISHLIST: (itemId: string) => `/cart/wishlist/${itemId}`,
  BACKEND_MOVE_TO_CART: (itemId: string) => `/cart/wishlist/${itemId}/move-to-cart`,
} as const;

// Auctions
export const AUCTION_ENDPOINTS = {
  GET_ALL: '/auctions',
  BIDS: '/auctions/bids',
} as const;

// Bulk Operations
export const BULK_ENDPOINTS = {
  OPERATIONS: '/bulk/operations',
  VALIDATE: '/bulk/validate',
  CLEANUP: '/bulk/cleanup',
  CONVERT: '/bulk/convert',
  EXPORT: {
    JOBS: '/bulk/export/jobs',
    STATS: '/bulk/export/stats',
    TEMPLATES: '/bulk/export/templates',
  },
  IMPORT: {
    JOBS: '/bulk/import/jobs',
    PREVIEW: '/bulk/import/preview',
    STATS: '/bulk/import/stats',
    TEMPLATES: '/bulk/import/templates',
  },
} as const;

// Bundles
export const BUNDLE_ENDPOINTS = {
  GET_ALL: '/bundles',
  ACTIVITY: '/bundles/activity',
  SEARCH: '/bundles/search',
  STATS: '/bundles/stats',
  SUGGESTIONS: '/bundles/suggestions',
  RECOMMENDATIONS: '/bundles/recommendations',
  PROMOTIONS: '/bundles/promotions',
  TEMPLATES: '/bundles/templates',
  EXPORT: '/bundles/export',
  IMPORT: '/bundles/import',
  BULK: {
    ACTIVATE: '/bundles/bulk/activate',
    DEACTIVATE: '/bundles/bulk/deactivate',
    ARCHIVE: '/bundles/bulk/archive',
    DELETE: '/bundles/bulk/delete',
    PRICING: '/bundles/bulk/pricing',
  },
} as const;

// Wishlist & Comparison
export const WISHLIST_ENDPOINTS = {
  GET_ALL: '/wishlist',
  ITEMS: '/wishlist/items',
  API_WISHLIST: '/api/wishlist',
  API_WISHLISTS: '/api/wishlists',
} as const;

export const COMPARISON_ENDPOINTS = {
  LISTS: '/comparisons/lists',
  COMPARE: '/comparisons/compare',
} as const;

// Customer Management
export const CUSTOMER_ENDPOINTS = {
  GET_ALL: '/customers',
  PROFILE: '/customers/profile',
  ADDRESSES: '/customers/addresses',
  AVATAR: '/customers/avatar',
  LOYALTY: '/customers/loyalty',
  ACCOUNT: {
    PROFILE: '/customer/profile',
    AVATAR: '/customer/profile/avatar',
    STATS: '/customer/profile/stats',
    DELETE: '/customer/account/delete',
    ADDRESSES: '/customer/addresses',
    ADDRESS_SUGGESTIONS: '/customer/addresses/suggestions',
    ADDRESS_VALIDATE: '/customer/addresses/validate',
    PREFERENCES: '/customer/preferences',
    DISPLAY_PREFERENCES: '/customer/preferences/display',
    NOTIFICATION_PREFERENCES: '/customer/preferences/notifications',
    PRIVACY_PREFERENCES: '/customer/preferences/privacy',
    SHOPPING_PREFERENCES: '/customer/preferences/shopping',
    QUESTIONS: '/customer/questions',
    REVIEWS: '/customer/reviews',
    PENDING_REVIEWS: '/customer/reviews/pending',
    SECURITY: '/customer/security',
    SECURITY_PREFERENCES: '/customer/security/preferences',
    SECURITY_QUESTIONS: '/customer/security/questions',
    WISHLIST: '/customer/wishlist',
    SHARE_WISHLIST: '/customer/wishlist/share',
  },
} as const;

// CMS & Content Management
export const CMS_ENDPOINTS = {
  PAGES: '/cms/pages',
  BLOG: '/cms/blog',
  PUBLISHED_BLOG: '/cms/blog/published',
  ANNOUNCEMENTS: '/cms/announcements',
  ACTIVE_ANNOUNCEMENTS: '/cms/announcements/active',
  BANNERS: '/cms/banners',
  ACTIVE_BANNERS: '/cms/banners/active',
  REORDER_BANNERS: '/cms/banners/reorder',
  FAQS: '/cms/faqs',
  ACTIVE_FAQS: '/cms/faqs/active',
  TESTIMONIALS: '/cms/testimonials',
  ACTIVE_TESTIMONIALS: '/cms/testimonials/active',
  FEATURED_TESTIMONIALS: '/cms/testimonials/featured',
  MEDIA: '/cms/media',
  MEDIA_FOLDERS: '/cms/media/folders',
  MEDIA_UPLOAD: '/cms/media/upload',
  MENUS: '/cms/menus',
  NEWSLETTER: '/cms/newsletter',
} as const;

// Chat & Communication
export const CHAT_ENDPOINTS = {
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: '/chat/messages',
} as const;

export const EMAIL_ENDPOINTS = {
  CAMPAIGNS: '/email/campaigns',
  STATS: '/email/stats',
  TEMPLATES: '/email/templates',
  TEST: '/email/test',
  VARIABLES: '/email/variables',
} as const;

// Contact & Support
export const CONTACT_ENDPOINTS = {
  SUBMIT: '/contact',
  INFO: '/contact/info',
} as const;

// Currency Management
export const CURRENCY_ENDPOINTS = {
  GET_ALL: '/currencies',
  CONVERSIONS: '/currencies/conversions',
  CONVERT: '/currencies/convert',
  COUNTRIES: '/currencies/countries',
  DETECT: '/currencies/detect',
  FORMAT: '/currencies/format',
  PARSE: '/currencies/parse',
  POPULAR: '/currencies/popular',
  SEARCH: '/currencies/search',
  SUGGESTIONS: '/currencies/suggestions',
  VALIDATE: '/currencies/validate',
  SETTINGS: '/currencies/settings',
  STATS: '/currencies/stats',
  EXPORT: '/currencies/export',
  IMPORT: '/currencies/import',
  BULK: {
    ACTIVATE: '/currencies/bulk/activate',
    DEACTIVATE: '/currencies/bulk/deactivate',
    DELETE: '/currencies/bulk/delete',
  },
} as const;

// Gamification
export const GAMIFICATION_ENDPOINTS = {
  PROFILE: '/gamification/profile',
  ACHIEVEMENTS: '/gamification/achievements',
  BADGES: '/gamification/badges',
  CHALLENGES: '/gamification/challenges',
  LEADERBOARD: '/gamification/leaderboard',
} as const;

// Help & Support
export const HELP_ENDPOINTS = {
  ARTICLES: '/help/articles',
  SEARCH_ARTICLES: '/help/articles/search',
  CATEGORIES: '/help/categories',
  FAQS: '/help/faqs',
  SEARCH_FAQS: '/help/faqs/search',
  SEARCH_SUGGESTIONS: '/help/search/suggestions',
  TRACK_SEARCH: '/help/search/track',
  ANALYTICS: '/help/analytics',
} as const;

// System Logs
export const LOG_ENDPOINTS = {
  LOGIN: '/login',
  ACTIVITY: '/logs/activity',
  ERRORS: '/logs/errors',
  EXPORT: '/logs/export',
  SEARCH: '/logs/search',
  SECURITY: '/logs/security',
  STATS: '/logs/stats',
  SYSTEM: '/logs/system',
} as const;

// Loyalty Program
export const LOYALTY_ENDPOINTS = {
  ANALYTICS: '/loyalty/analytics',
  BULK_ENROLL: '/loyalty/bulk/enroll',
  CAMPAIGNS: '/loyalty/campaigns',
  CUSTOMERS: '/loyalty/customers',
  ENROLL_CUSTOMERS: '/loyalty/customers/enroll',
  ENGAGEMENTS: '/loyalty/engagements',
  EXPORT_CUSTOMERS: '/loyalty/export/customers',
  EXPORT_REWARDS: '/loyalty/export/rewards',
  EXPORT_TRANSACTIONS: '/loyalty/export/transactions',
  PROGRAMS: '/loyalty/programs',
  REDEEM: '/loyalty/redeem',
  REWARDS: '/loyalty/rewards',
  RULES: '/loyalty/rules',
  TEST_RULES: '/loyalty/rules/test',
  TIERS: '/loyalty/tiers',
  REORDER_TIERS: '/loyalty/tiers/reorder',
  TRANSACTIONS: '/loyalty/transactions',
} as const;

// Notifications
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  PREFERENCES: '/notifications/preferences',
  PUSH_SUBSCRIBE: '/notifications/push/subscribe',
  PUSH_UNSUBSCRIBE: '/notifications/push/unsubscribe',
} as const;

// Payment & Wallet
export const PAYMENT_ENDPOINTS = {
  METHODS: '/payment/methods',
  PROCESS: '/payments/process',
} as const;

export const WALLET_ENDPOINTS = {
  GET: '/wallet',
  TRANSACTIONS: '/wallet/transactions',
  REQUEST_PAYOUT: '/wallet/payout/request',
  PAYOUT_REQUESTS: '/wallet/payout/requests',
} as const;

// Questions & Reviews
export const QUESTION_ENDPOINTS = {
  SEARCH: '/questions/search',
} as const;

export const REVIEW_ENDPOINTS = {
  GET_ALL: '/reviews',
  CUSTOMER: '/reviews/customer',
} as const;

// RFQ (Request for Quote)
export const RFQ_ENDPOINTS = {
  GET_ALL: '/rfq',
  ATTACHMENTS: '/rfq/attachments',
  QUOTATIONS: '/rfq/quotations',
} as const;

// Returns & Warranty
export const RETURN_POLICY_ENDPOINTS = {
  GET_POLICY: '/returns/policy',
} as const;

export const WARRANTY_ENDPOINTS = {
  GET_ALL: '/warranties',
  CLAIMS: '/warranties/claims',
  PURCHASE: '/warranties/purchase',
  REGISTER: '/warranties/register',
} as const;

// SEO Management
export const SEO_ENDPOINTS = {
  ANALYTICS: '/seo/analytics',
  AUDITS: '/seo/audits',
  SCHEDULE_AUDITS: '/seo/audits/schedule',
  COMPETITORS: '/seo/competitors',
  KEYWORDS: '/seo/keywords',
  KEYWORD_SUGGESTIONS: '/seo/keywords/suggestions',
  REDIRECTS: '/seo/redirects',
  GENERATE_REPORTS: '/seo/reports/generate',
  SETTINGS: '/seo/settings',
  SITEMAP_ENTRIES: '/seo/sitemap/entries',
  GENERATE_SITEMAP: '/seo/sitemap/generate',
  TEMPLATES: '/seo/templates',
} as const;

// Settings
export const SETTING_ENDPOINTS = {
  GENERAL: '/settings',
  EMAIL: '/settings/email',
  GENERAL_SETTINGS: '/settings/general',
  PAYMENT: '/settings/payment',
  SEO: '/settings/seo',
} as const;

// Shipping
export const SHIPPING_ENDPOINTS = {
  CARRIERS: '/shipping/carriers',
  METHODS: '/shipping/methods',
  TRACK: '/shipping/track',
  ZONES: '/shipping/zones',
} as const;

// Stores
export const STORE_ENDPOINTS = {
  GET_ALL: '/stores',
  NEARBY: '/stores/nearby',
  SEARCH: '/stores/search',
} as const;

// Support Tickets
export const SUPPORT_ENDPOINTS = {
  TICKETS: '/support/tickets',
} as const;

// Tax Management
export const TAX_ENDPOINTS = {
  CALCULATE: '/tax/calculate',
  COUNTRIES: '/tax/countries',
  EXEMPTIONS: '/tax/exemptions',
  RATES: '/tax/rates',
  EXPORT_RATES: '/tax/rates/export',
  IMPORT_RATES: '/tax/rates/import',
  LOCATION_RATES: '/tax/rates/location',
  STATS: '/tax/stats',
} as const;

// Vendor Management
export const VENDOR_ENDPOINTS = {
  GET_ALL: '/vendors',
  PROFILE: '/vendors/profile',
  STATS: '/vendors/stats',
  LOGO: '/vendors/logo',
  BANNER: '/vendors/banner',
  KYC: {
    DOCUMENTS: '/vendors/kyc/documents',
    SUBMIT: '/vendors/kyc/submit',
    UPLOAD: '/vendors/kyc/upload',
  },
} as const;

// Voice Search
export const VOICE_ENDPOINTS = {
  SEARCH: '/voice/search',
  SEARCH_TEXT: '/voice/search/text',
  HISTORY: '/voice/history',
  LANGUAGES: '/voice/languages',
  SETTINGS: '/voice/settings',
} as const;

// File Upload
export const UPLOAD_ENDPOINTS = {
  SINGLE: '/upload',
  MULTIPLE: '/upload/multiple',
  IMAGE: '/upload/image',
  DELETE: (fileId: string) => `/upload/${fileId}`,
} as const;

// System
export const SYSTEM_ENDPOINTS = {
  HEALTH: '/health',
} as const;

// Combined exports for convenience
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  PRODUCTS: PRODUCT_ENDPOINTS,
  API_PRODUCTS: API_PRODUCT_ENDPOINTS,
  ORDERS: ORDER_ENDPOINTS,
  ADVANCED_ORDERS: ADVANCED_ORDER_ENDPOINTS,
  DEALS: DEALS_ENDPOINTS,
  COUPONS: COUPON_ENDPOINTS,
  PROMOTIONS: PROMOTION_ENDPOINTS,
  FLASH_SALES: FLASH_SALE_ENDPOINTS,
  REPORTS: REPORT_ENDPOINTS,
  INVENTORY: INVENTORY_ENDPOINTS,
  RETURNS: RETURN_ENDPOINTS,
  DIGITAL_PRODUCTS: DIGITAL_PRODUCT_ENDPOINTS,
  SUBSCRIPTIONS: SUBSCRIPTION_ENDPOINTS,
  AFFILIATE: AFFILIATE_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
  CATEGORIES: CATEGORY_ENDPOINTS,
  BRANDS: BRAND_ENDPOINTS,
  API_BRANDS: API_BRAND_ENDPOINTS,
  API_CATEGORIES: API_CATEGORY_ENDPOINTS,
  CART: CART_ENDPOINTS,
  AUCTIONS: AUCTION_ENDPOINTS,
  BULK: BULK_ENDPOINTS,
  BUNDLES: BUNDLE_ENDPOINTS,
  WISHLIST: WISHLIST_ENDPOINTS,
  COMPARISON: COMPARISON_ENDPOINTS,
  CUSTOMERS: CUSTOMER_ENDPOINTS,
  CMS: CMS_ENDPOINTS,
  CHAT: CHAT_ENDPOINTS,
  EMAIL: EMAIL_ENDPOINTS,
  CONTACT: CONTACT_ENDPOINTS,
  CURRENCIES: CURRENCY_ENDPOINTS,
  GAMIFICATION: GAMIFICATION_ENDPOINTS,
  HELP: HELP_ENDPOINTS,
  LOGS: LOG_ENDPOINTS,
  LOYALTY: LOYALTY_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  WALLET: WALLET_ENDPOINTS,
  QUESTIONS: QUESTION_ENDPOINTS,
  REVIEWS: REVIEW_ENDPOINTS,
  RFQ: RFQ_ENDPOINTS,
  RETURN_POLICY: RETURN_POLICY_ENDPOINTS,
  WARRANTIES: WARRANTY_ENDPOINTS,
  SEO: SEO_ENDPOINTS,
  SETTINGS: SETTING_ENDPOINTS,
  SHIPPING: SHIPPING_ENDPOINTS,
  STORES: STORE_ENDPOINTS,
  SUPPORT: SUPPORT_ENDPOINTS,
  TAX: TAX_ENDPOINTS,
  VENDORS: VENDOR_ENDPOINTS,
  VOICE: VOICE_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  SYSTEM: SYSTEM_ENDPOINTS,
  // Backend endpoints (actual APIs)
  BACKEND_CMS: BACKEND_CMS_ENDPOINTS,
  BACKEND_ORDERS: BACKEND_ORDER_ENDPOINTS,
  BACKEND_DEALS: BACKEND_DEALS_ENDPOINTS,
  BACKEND_COUPONS: BACKEND_COUPON_ENDPOINTS,
  BACKEND_PROMOTIONS: BACKEND_PROMOTION_ENDPOINTS,
  BACKEND_SUPPORT: BACKEND_SUPPORT_ENDPOINTS,
  BACKEND_UPLOAD: BACKEND_UPLOAD_ENDPOINTS,
  BACKEND_RFQ: BACKEND_RFQ_ENDPOINTS,
  BACKEND_PAYMENT: BACKEND_PAYMENT_ENDPOINTS,
  BACKEND_FINANCE: BACKEND_FINANCE_ENDPOINTS,
  BACKEND_ADMIN: BACKEND_ADMIN_ENDPOINTS,
  BACKEND_BOOTSTRAP: BACKEND_BOOTSTRAP_ENDPOINTS,
} as const;

// Helper functions for common patterns
export const buildEndpoint = {
  withId: (base: string, id: string) => `${base}/${id}`,
  withParams: (base: string, params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `${base}?${queryString}` : base;
  },
};

// Type definitions for better TypeScript support
export type EndpointFunction = (id: string) => string;
export type EndpointWithParams = (params: Record<string, any>) => string;

export default API_ENDPOINTS;