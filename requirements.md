## Groow Platform Requirements

### Functional Requirements

- **User Roles**
  - Admins manage the entire marketplace (users, vendors, services, orders, CMS, reports, settings).
  - Vendors manage their own services, orders, customers, finances, and analytics via the vendor portal.
  - Customers browse services, manage carts, place orders, manage accounts, and access support via the customer portal.

- **Authentication & Authorization**
  - Email/password login and registration for all roles.
  - JWT-based authentication with access/refresh tokens.
  - Role-based access control for admin, vendor, and customer areas.
  - Password reset, email verification, and secure logout.

- **Service & Product Catalog**
  - Service categories and sub‑categories with hierarchy.
  - Brands/partners management.
  - Detailed service/product pages with pricing, specs, and media.
  - Search, filters, and sorting for catalog browsing.

- **Orders, Cart, and Checkout**
  - Shopping cart with add/update/remove items and quantity controls.
  - Guest and registered checkout flow.
  - Order placement, status tracking, and history for customers.
  - Order management for admins and vendors (fulfilment, status updates, refunds).

- **Vendor Portal**
  - Vendor onboarding and profile/KYC management.
  - Service portfolio management (create/update/remove services and packages).
  - Order list, fulfilment controls, and communication with customers.
  - Vendor analytics (sales, revenue, service performance).

- **Admin Portal**
  - Dashboards with key KPIs (revenue, orders, customers, vendors, services).
  - CRUD management for users, vendors, services, orders, promotions, and CMS content.
  - Finance views (transactions, payouts, refunds, revenue reports).
  - Security monitoring, audit logs, and configuration.

- **Marketing & Engagement**
  - Deals, coupons, promotions, and flash‑sales management.
  - Loyalty programs, points, and rewards.
  - Wishlist and saved items.
  - Reviews, ratings, Q&A, and testimonials.

- **CMS & Content**
  - Pages, FAQs, banners, and media library.
  - Configurable menus and static content (privacy, terms, etc.).

- **Support & Communication**
  - Support tickets, help center, and notification center.
  - Email/SMS/push notifications for key events (orders, payments, support).

- **Advanced Features**
  - RFQ (Request for Quote) workflows.
  - Digital products and downloads.
  - Subscriptions and recurring billing.
  - Basic analytics and reports for core entities.

### Non‑Functional Requirements

- **Security**
  - All public endpoints served over HTTPS.
  - JWT‑based auth, secure password storage, and protection against common web attacks (XSS, CSRF, SQL injection).
  - Security headers via Caddy (HSTS, X‑Frame‑Options, X‑Content‑Type‑Options, etc.).

- **Performance & Reliability**
  - Production build of the React/Umi frontend with gzip/zstd compression.
  - Backend on NestJS + PostgreSQL with indices and basic query optimisation.
  - Reverse proxy and process management with Caddy + PM2.

- **Testing & Quality**
  - Cypress test suites covering core APIs and flows.
  - API smoke tests via shell script.
  - Defensive frontend data handling for inconsistent API shapes.

- **Deployment & Ops**
  - Deployed on an Azure Linux VM with Caddy as reverse proxy.
  - PM2 used to run backend and serve the built frontend.
  - DNS via Cloudflare pointing `groow.destinpq.com` and `groow-api.destinpq.com` to the VM.


