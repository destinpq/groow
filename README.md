# Groow - E-Commerce Platform

A comprehensive B2B/B2C e-commerce platform with admin, vendor, and customer portals.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Session Management
- **Notifications**: Email (SMTP) + Push Notifications
- **File Storage**: Local/Cloud (S3 compatible)
- **Payment**: Payment Gateway Integration

## Project Structure

```
├── backend/          # NestJS API
├── frontend/         # Next.js Application
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm/npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Configure environment variables (see .env.example in each folder)

4. Run with Docker:
   ```bash
   docker-compose up -d
   ```

### Development

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Features

- Admin Portal: Complete CMS, user management, settings
- Vendor Portal: Product management, RFQ, orders, analytics
- Customer Portal: Shopping, RFQ, wishlist, order tracking
- Real-time notifications
- Advanced search & filters
- Import/Export functionality
- Role-based access control

## License

Proprietary
