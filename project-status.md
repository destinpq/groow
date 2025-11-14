## Groow Project Status

### High‑Level Overview

- **Platform:** Groow B2B IT services marketplace (admin, vendor, customer portals).
- **Status:** Production‑ready and deployed.
- **Frontend:** React + UmiJS + Ant Design + TypeScript.
- **Backend:** NestJS + PostgreSQL + TypeORM + JWT.
- **Infra:** Azure VM, Caddy reverse proxy, PM2 process manager.

### Live URLs

- **Frontend:** `https://groow.destinpq.com`
- **Backend API (v1):** `https://groow-api.destinpq.com/api/v1`
- **API docs / Swagger:** typically exposed under `/api/docs` or `/api-json` depending on environment.

### Runtime & Deployment

- **Backend (PM2 app `groow-backend`):**
  - Port: `21440` (behind Caddy).
  - Env: `NODE_ENV` `development` or `production` as configured in `ecosystem.config.js`.
- **Frontend (PM2 app `groow-frontend-static`):**
  - Serves the built `dist` directory on port `21441`.
  - Caddy terminates TLS and proxies `groow.destinpq.com` to this port.
- **Reverse Proxy (Caddy):**
  - Terminates HTTPS for all destinpq.com apps.
  - Proxies `groow.destinpq.com` and `groow-api.destinpq.com` to the Groow frontend and backend.

### Codebase Structure (Short)

- `frontend/`: UmiJS app (`src/pages`, `src/services/api`, `src/layouts`, `src/store`, etc.).
- `backend/`: NestJS app (`src/modules`, `src/database`, etc.).
- `cypress-tests/`: API and E2E tests.
- `ecosystem.config.js`: PM2 processes for backend and frontend.
- `Caddyfile`: Caddy configuration for all domains including Groow.

### Feature Completion Snapshot

- **Admin features:** dashboards, full CRUD on catalog, orders, vendors, customers, CMS, finance, and reports implemented.
- **Customer features:** browse services, cart, checkout, orders, account, wishlist, reviews, support implemented.
- **Vendor features:** vendor dashboards, service/catalog management, orders, analytics, marketing, and finance implemented.
- **APIs:** 180+ endpoints implemented, with core e‑commerce flows working end‑to‑end.

### Known Behaviours / Non‑Blocking Issues

- Some “advanced” or low‑priority endpoints may still return `404` or `501` and are handled gracefully by the frontend (empty states or skipped tests).
- External demo image providers and logo CDNs may be blocked by ad‑blockers (cosmetic only).

### Operational Commands (Reference)

- **PM2**
  - `pm2 ls` – list processes.
  - `pm2 restart groow-backend` – restart backend.
  - `pm2 restart groow-frontend-static` – restart static frontend.
  - `pm2 logs groow-backend` / `pm2 logs groow-frontend-static` – tail logs.
  - `pm2 save` – persist PM2 process list.

- **Backend**
  - `cd backend && npm install`
  - `npm run build`
  - `npm run start:dev` (dev) or `npm run start:prod` (prod).
  - `npm run seed` – seed database (when needed).

- **Frontend**
  - `cd frontend && npm install`
  - `npm run dev` – development.
  - `npm run build` – production build.


