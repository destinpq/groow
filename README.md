## Groow E‑Commerce Platform

**Status:** ✅ Production‑ready  
**Frontend:** `https://groow.destinpq.com`  
**Backend API:** `https://groow-api.destinpq.com/api/v1`

---

### What this README is for

This file gives you a **very short overview** and then points you to the three focused docs where all details now live:

- `requirements.md` – high‑level functional and non‑functional requirements.
- `project-status.md` – architecture, deployment, and current status.
- `testing.md` – how to run Cypress, shell tests, and manual test flows.

The older large documentation files have been merged into these three to keep things clean and easy to maintain.

---

### Quickstart (local)

- **Backend**
  - `cd backend && npm install`
  - `npm run build`
  - `npm run start:dev`

- **Frontend**
  - `cd frontend && npm install`
  - `npm run dev`

For PM2/Caddy/production and deeper details, see `project-status.md`.

---

### Test Entry Points

- Full Cypress suite: see `testing.md` (`cypress-tests` folder).
- API smoke tests: `bash test-all-apis.sh` from the repo root.

---

### Docs Map

- Platform requirements → `requirements.md`
- Deployment & architecture → `project-status.md`
- Automated + manual testing → `testing.md`

