# Frontend API Endpoints Reference

This document lists all the API endpoints that the frontend is expecting to call. This is a comprehensive list extracted from all the API service files in the frontend.

## Authentication & Users

### Auth API (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Email verification
- `GET /auth/profile` - Get user profile

## Core E-commerce

### Products API (`/products`)
- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders API (`/orders`)
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `GET /orders/number/:orderNumber` - Get order by number
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Update order status
- `POST /orders/:id/cancel` - Cancel order
- `PATCH /orders/:id/tracking` - Update tracking info
- `GET /customers/:customerId/orders` - Get customer orders
- `GET /vendors/:vendorId/orders` - Get vendor orders
- `GET /orders/track/:trackingNumber` - Track order
- `POST /orders/:id/refund` - Process refund
- `GET /orders/export` - Export orders

### Advanced Orders API (`/orders/advanced`)
- `GET /orders/advanced` - Get advanced orders
- `GET /orders/advanced/:orderId` - Get advanced order
- `PATCH /orders/advanced/:orderId` - Update advanced order
- `PATCH /orders/advanced/:orderId/status` - Update status
- `PATCH /orders/advanced/:orderId/assign` - Assign order
- `POST /orders/advanced/:orderId/escalate` - Escalate order
- `GET /orders/advanced/:orderId/can-split` - Check if can split
- `POST /orders/advanced/:orderId/split` - Split order
- `GET /orders/advanced/:orderId/splits` - Get order splits
- `POST /orders/advanced/:parentOrderId/merge-splits` - Merge splits
- `GET /orders/advanced/:orderId/timeline` - Get timeline
- `POST /orders/advanced/:orderId/events` - Add event
- `PATCH /orders/advanced/:orderId/events/:eventId` - Update event
- `GET /orders/advanced/:orderId/notes` - Get notes
- `POST /orders/advanced/:orderId/notes` - Add note
- `PATCH /orders/advanced/:orderId/notes/:noteId` - Update note
- `DELETE /orders/advanced/:orderId/notes/:noteId` - Delete note
- `POST /orders/advanced/:orderId/tags` - Add tags
- `DELETE /orders/advanced/:orderId/tags` - Remove tags
- `PATCH /orders/advanced/:orderId/tracking` - Update tracking
- `POST /orders/advanced/:orderId/tracking/events` - Add tracking event
- `PATCH /orders/advanced/:orderId/fulfillment` - Update fulfillment
- `POST /orders/advanced/:orderId/shipping-label` - Generate shipping label
- `POST /orders/advanced/:orderId/packing-slip` - Generate packing slip
- `GET /orders/workflow-templates` - Get workflow templates
- `POST /orders/workflow-templates` - Create template
- `PATCH /orders/workflow-templates/:templateId` - Update template
- `DELETE /orders/workflow-templates/:templateId` - Delete template
- `POST /orders/advanced/:orderId/apply-workflow` - Apply workflow
- `POST /orders/batches` - Create batch
- `GET /orders/batches` - Get batches
- `GET /orders/batches/:batchId` - Get batch
- `POST /orders/batches/:batchId/process` - Process batch
- `PATCH /orders/batch/status` - Bulk update status
- `PATCH /orders/batch/assign` - Bulk assign
- `PATCH /orders/batch/tags` - Bulk update tags
- `POST /orders/batch/export` - Bulk export
- `GET /orders/stats` - Order statistics
- `GET /orders/performance` - Performance metrics
- `GET /orders/trends` - Order trends
- `GET /orders/fulfillment-analytics` - Fulfillment analytics
- `GET /orders/search` - Search orders
- `GET /orders/filter-options` - Get filter options
- `GET /orders/automation-rules` - Get automation rules
- `POST /orders/automation-rules` - Create automation rule
- `PATCH /orders/automation-rules/:ruleId` - Update rule
- `DELETE /orders/automation-rules/:ruleId` - Delete rule
- `POST /orders/automation-rules/:ruleId/test` - Test rule
- `POST /orders/advanced/:orderId/email` - Send email
- `POST /orders/advanced/:orderId/sms` - Send SMS
- `GET /orders/advanced/:orderId/communications` - Get communications
- `POST /orders/advanced/:orderId/predict-delivery` - Predict delivery
- `POST /orders/optimize-routing` - Optimize routing
- `GET /orders/advanced/:orderId/anomalies` - Detect anomalies
- `GET /orders/advanced/:orderId/recommendations` - Get recommendations

## Marketing & Promotions

### Deals API (`/deals`)
- `GET /deals` - Get all deals
- `GET /deals/:id` - Get deal by ID
- `POST /deals` - Create deal
- `PUT /deals/:id` - Update deal
- `DELETE /deals/:id` - Delete deal
- `GET /deals/stats` - Get deals statistics
- `GET /deals/:id/analytics` - Get deal analytics
- `GET /deals/:dealId/usage` - Get deal usage
- `PATCH /deals/:id/toggle-status` - Toggle deal status
- `POST /deals/:id/duplicate` - Duplicate deal
- `GET /deals/active` - Get active deals
- `POST /deals/:dealId/check-eligibility` - Check eligibility
- `POST /deals/:dealId/apply` - Apply deal
- `POST /deals/:dealId/track-click` - Track click
- `GET /deals/best-for-user/:userId` - Get best deals for user
- `POST /deals/bulk-delete` - Bulk delete deals
- `POST /deals/bulk-update-status` - Bulk update status
- `POST /deals/:dealId/upload-banner` - Upload banner
- `GET /deals/performance-report` - Performance report
- `GET /deals/trending` - Trending deals

### Coupons API (`/coupons`)
- `GET /coupons` - Get all coupons
- `GET /coupons/:id` - Get coupon by ID
- `POST /coupons` - Create coupon
- `PUT /coupons/:id` - Update coupon
- `DELETE /coupons/:id` - Delete coupon
- `GET /coupons/stats` - Coupon statistics

### Promotions API (`/promotions`)
- `GET /promotions` - Get all promotions
- `GET /promotions/:id` - Get promotion by ID
- `POST /promotions` - Create promotion
- `PUT /promotions/:id` - Update promotion
- `DELETE /promotions/:id` - Delete promotion
- `GET /promotions/stats` - Promotion statistics

### Flash Sales API (`/flash-sales`)
- `GET /flash-sales` - Get flash sales
- `GET /flash-sales/:id` - Get flash sale
- `POST /flash-sales` - Create flash sale
- `PUT /flash-sales/:id` - Update flash sale
- `DELETE /flash-sales/:id` - Delete flash sale
- `POST /flash-sales/:id/start` - Start flash sale
- `POST /flash-sales/:id/end` - End flash sale
- `POST /flash-sales/:id/cancel` - Cancel flash sale
- `POST /flash-sales/:id/extend` - Extend flash sale
- `POST /flash-sales/:id/duplicate` - Duplicate flash sale
- `POST /flash-sales/:saleId/products` - Add products
- `DELETE /flash-sales/:saleId/products/:productId` - Remove product
- `PUT /flash-sales/:saleId/products/:productId/price` - Update price
- `PUT /flash-sales/:saleId/products/:productId/inventory` - Update inventory
- `GET /daily-deals` - Get daily deals
- `POST /daily-deals` - Create daily deal
- `PUT /daily-deals/:id` - Update daily deal
- `DELETE /daily-deals/:id` - Delete daily deal
- `GET /flash-sales/templates` - Get templates
- `POST /flash-sales/templates` - Create template
- `PUT /flash-sales/templates/:id` - Update template
- `DELETE /flash-sales/templates/:id` - Delete template
- `POST /flash-sales/templates/:templateId/apply` - Apply template
- `GET /flash-sales/stats` - Flash sales stats
- `GET /flash-sales/:saleId/analytics` - Sale analytics
- `GET /flash-sales/:saleId/performance` - Sale performance
- `GET /flash-sales/activity` - Flash sales activity
- `POST /flash-sales/:saleId/notify` - Send notifications
- `GET /flash-sales/:saleId/subscribers` - Get subscribers
- `POST /flash-sales/bulk/start` - Bulk start sales
- `POST /flash-sales/bulk/end` - Bulk end sales
- `POST /flash-sales/bulk/cancel` - Bulk cancel sales
- `POST /flash-sales/bulk/delete` - Bulk delete sales
- `GET /flash-sales/search` - Search flash sales
- `GET /flash-sales/suggestions` - Get suggestions
- `GET /flash-sales/export` - Export flash sales
- `POST /flash-sales/import` - Import flash sales
- `GET /flash-sales/live` - Get live sales
- `GET /flash-sales/upcoming` - Get upcoming sales
- `GET /flash-sales/:saleId/countdown` - Get countdown

## Reports & Analytics

### Reports API (`/reports`)
- `GET /reports/dashboard` - Dashboard analytics
- `GET /reports/recent-activities` - Recent activities
- `GET /reports/system-health` - System health
- `GET /reports/sales` - Sales reports
- `GET /reports/products` - Product reports
- `GET /reports/customers` - Customer reports
- `GET /reports/vendors` - Vendor reports
- `GET /reports/rfq` - RFQ reports
- `GET /reports/subscriptions` - Subscription reports
- `GET /reports/categories` - Category reports

## Inventory Management

### Inventory Alerts API (`/inventory`)
- `GET /inventory/alerts` - Get alerts
- `GET /inventory/alerts/:id` - Get alert
- `POST /inventory/alerts/:id/acknowledge` - Acknowledge alert
- `POST /inventory/alerts/:id/resolve` - Resolve alert
- `POST /inventory/alerts/:id/dismiss` - Dismiss alert
- `PUT /inventory/alerts/:id/severity` - Update severity
- `GET /inventory/alert-rules` - Get alert rules
- `GET /inventory/alert-rules/:id` - Get alert rule
- `POST /inventory/alert-rules` - Create alert rule
- `PUT /inventory/alert-rules/:id` - Update alert rule
- `DELETE /inventory/alert-rules/:id` - Delete alert rule
- `POST /inventory/alert-rules/:id/toggle` - Toggle rule
- `POST /inventory/alert-rules/:id/test` - Test rule
- `GET /inventory/thresholds` - Get thresholds
- `GET /inventory/thresholds/:productId` - Get threshold
- `POST /inventory/thresholds` - Create threshold
- `PUT /inventory/thresholds/:productId` - Update threshold
- `DELETE /inventory/thresholds/:productId` - Delete threshold
- `POST /inventory/thresholds/bulk-update` - Bulk update thresholds
- `GET /inventory/notification-channels` - Get notification channels
- `POST /inventory/notification-channels` - Create channel
- `PUT /inventory/notification-channels/:id` - Update channel
- `DELETE /inventory/notification-channels/:id` - Delete channel
- `POST /inventory/notification-channels/:id/test` - Test channel
- `POST /inventory/notification-channels/:id/set-default` - Set default
- `GET /inventory/alerts/stats` - Alert statistics
- `GET /inventory/alerts/trends` - Alert trends
- `GET /inventory/alerts/top-products` - Top products with alerts
- `POST /inventory/alerts/bulk-action` - Bulk action
- `POST /inventory/alerts/bulk-acknowledge` - Bulk acknowledge
- `POST /inventory/alerts/bulk-resolve` - Bulk resolve
- `POST /inventory/alerts/check-now` - Check now
- `GET /inventory/alerts/realtime` - Realtime alerts
- `GET /inventory/alerts/export` - Export alerts
- `POST /inventory/alerts/reports` - Generate report
- `GET /inventory/alerts/threshold-suggestions/:productId` - Threshold suggestions
- `GET /inventory/alerts/optimization-suggestions` - Optimization suggestions
- `GET /inventory/alerts/settings` - Get settings
- `PUT /inventory/alerts/settings` - Update settings

## Returns & Refunds

### Returns API (`/returns`)
- `GET /returns` - Get returns
- `GET /returns/:id` - Get return
- `GET /returns/rma/:rmaNumber` - Get by RMA number
- `POST /returns` - Create return
- `PATCH /returns/:id` - Update return
- `DELETE /returns/:id` - Delete return
- `POST /returns/:id/approve` - Approve return
- `POST /returns/:id/reject` - Reject return
- `POST /returns/:id/received` - Mark as received
- `POST /returns/:id/inspect` - Inspect return
- `POST /returns/:id/complete` - Complete return
- `POST /returns/:id/cancel` - Cancel return
- `GET /returns/:returnId/timeline` - Get timeline
- `GET /returns/stats` - Return statistics
- `GET /returns/customer/:customerId` - Customer returns
- `POST /returns/bulk/approve` - Bulk approve
- `POST /returns/bulk/reject` - Bulk reject
- `DELETE /returns/bulk` - Bulk delete
- `GET /returns/:returnId/label` - Get return label
- `POST /returns/export` - Export returns
- `GET /returns/search` - Search returns

## Digital Products & Subscriptions

### Digital Downloads API (`/customer/digital-products`)
- `GET /customer/digital-products` - Get digital products
- `GET /customer/digital-products/:id` - Get digital product
- `GET /customer/orders/:orderId/digital-products` - Order digital products
- `POST /customer/digital-products/download` - Download product
- `GET /customer/digital-products/download-history` - Download history
- `GET /customer/digital-products/stats` - Download statistics
- `POST /customer/digital-products/verify-license` - Verify license
- `POST /customer/digital-products/activate-license` - Activate license
- `POST /customer/digital-products/deactivate-license` - Deactivate license
- `GET /customer/digital-products/:productId/activations` - License activations
- `GET /customer/digital-products/updates` - Product updates
- `POST /customer/digital-products/:productId/update` - Update product
- `POST /customer/digital-products/:productId/support` - Contact support
- `POST /customer/digital-products/:productId/report-issue` - Report issue
- `GET /customer/digital-products/:productId/documentation` - Get docs
- `GET /customer/digital-products/:productId/changelog` - Get changelog
- `POST /customer/digital-products/:productId/resend-license` - Resend license
- `GET /customer/digital-products/by-license/:licenseKey` - Get by license
- `POST /customer/digital-products/:productId/refresh-link` - Refresh download link

### Subscriptions API (`/api/subscriptions`)
- `GET /api/subscriptions` - Get subscriptions
- `GET /api/subscriptions/:id` - Get subscription
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `POST /api/subscriptions/:id/pause` - Pause subscription
- `POST /api/subscriptions/:id/resume` - Resume subscription
- `POST /api/subscriptions/:id/cancel` - Cancel subscription
- `GET /api/products/:productId/subscription-plans` - Get plans
- `GET /api/subscriptions/:subscriptionId/billing-history` - Billing history
- `GET /api/subscriptions/stats` - Subscription stats
- `GET /api/billing/:billingId/invoice` - Get invoice
- `PUT /api/subscriptions/:subscriptionId/payment-method` - Update payment
- `GET /api/subscriptions/upcoming-renewals` - Upcoming renewals

## Affiliate & Partnerships

### Affiliate API (`/affiliate`)
- `GET /affiliate/programs` - Get affiliate programs
- `GET /affiliate/programs/:id` - Get affiliate program

## File Management

### Upload API (`/upload`)
- `POST /upload` - Upload file
- `POST /upload/multiple` - Upload multiple files
- `POST /upload/image` - Upload image
- `DELETE /upload/:fileId` - Delete file

## System & Health

### Health API (`/health`)
- `GET /health` - Health check

## Notes

1. **Authentication**: Most endpoints require JWT authentication via `Authorization: Bearer <token>` header
2. **Role-based Access**: Many admin endpoints require `ADMIN` role
3. **Pagination**: List endpoints typically support `page`, `limit`, `search` query parameters
4. **Error Handling**: All endpoints should return consistent error format with proper HTTP status codes
5. **Response Format**: Standard response format should be `{ success: boolean, data: any, message?: string }`

## Implementation Status

- ✅ Basic endpoints implemented in backend
- ⚠️  Many advanced endpoints need implementation
- ❌ Complex features like flash sales, advanced orders, inventory alerts need full implementation

This list serves as a roadmap for backend API development to ensure frontend-backend compatibility.