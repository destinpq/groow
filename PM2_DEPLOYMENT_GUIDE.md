# PM2 Deployment Guide for Groow Platform

## Overview
This guide covers PM2 process management for both frontend and backend applications of the Groow e-commerce platform.

## Prerequisites

### Install Dependencies
```bash
# Install PM2 globally
npm install -g pm2

# Install project dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Install serve for static frontend (production)
```bash
cd frontend
npm install serve --save-dev
```

## Quick Start

### Development Mode (Both Frontend & Backend)
```bash
./start-pm2.sh development
```

### Production Mode (Both Frontend & Backend)
```bash
./start-pm2.sh production
```

### Backend Only
```bash
./start-pm2.sh backend-only production
```

### Frontend Only
```bash
./start-pm2.sh frontend-only development
```

## Available Commands

### Start Services
- `./start-pm2.sh development` - Start both services in dev mode
- `./start-pm2.sh production` - Start both services in production mode
- `./start-pm2.sh staging` - Start both services in staging mode
- `./start-pm2.sh backend-only [env]` - Start only backend
- `./start-pm2.sh frontend-only [env]` - Start only frontend

### Manage Services
- `./start-pm2.sh stop` - Stop all services
- `./start-pm2.sh restart` - Restart all services
- `./start-pm2.sh status` - Show PM2 status
- `./start-pm2.sh logs` - Show logs for all services
- `./start-pm2.sh monitor` - Open PM2 monitoring dashboard

### Individual Commands
```bash
# Backend commands
cd backend
npm run pm2:start          # Start backend in development
npm run pm2:start:prod     # Start backend in production
npm run pm2:restart        # Restart backend
npm run pm2:stop          # Stop backend
npm run pm2:logs          # View backend logs

# Frontend commands
cd frontend
npm run pm2:dev           # Start frontend dev server
npm run pm2:serve         # Build and serve frontend static files
npm run pm2:stop          # Stop frontend services
npm run pm2:logs          # View frontend logs
```

## Process Information

### Backend (groow-backend)
- **Port**: 3001
- **Script**: `dist/main.js` (built from TypeScript)
- **Health Check**: http://localhost:3001/api/v1/health
- **API Docs**: http://localhost:3001/api/docs
- **Logs**: `backend/logs/backend-*.log`

### Frontend Development (groow-frontend-dev)
- **Port**: 8001
- **Script**: UmiJS dev server
- **Hot Reload**: Enabled
- **URL**: http://localhost:8001
- **Logs**: `frontend/logs/frontend-dev-*.log`

### Frontend Production (groow-frontend-static)
- **Port**: 8001
- **Script**: Static file server using `serve`
- **Built Files**: Serves from `frontend/dist/`
- **URL**: http://localhost:8001
- **Logs**: `frontend/logs/frontend-static-*.log`

## Environment Configurations

### Development
- Frontend: UmiJS dev server with hot reload
- Backend: Development mode with database sync
- Database: Sync enabled, logging enabled

### Production
- Frontend: Static files served via `serve`
- Backend: Production mode, optimized
- Database: Sync disabled, logging disabled
- Memory: Optimized limits and restart policies

### Staging
- Similar to production but with enhanced logging
- Used for testing before production deployment

## Monitoring

### Real-time Monitoring
```bash
pm2 monit
```

### Status Check
```bash
pm2 status
```

### View Logs
```bash
# All services
pm2 logs

# Specific service
pm2 logs groow-backend
pm2 logs groow-frontend-dev
pm2 logs groow-frontend-static
```

### Restart Services
```bash
# Restart all
pm2 restart all

# Restart specific
pm2 restart groow-backend
pm2 restart groow-frontend-dev
```

## Production Deployment

### Server Setup
1. Install Node.js and PM2 on the server
2. Clone the repository
3. Install dependencies
4. Configure environment variables
5. Build applications
6. Start with PM2

### Deployment Script
```bash
# On the server
git pull origin main
cd /path/to/groow

# Build and start
./start-pm2.sh production

# Setup auto-start on boot
pm2 startup
pm2 save
```

### Load Balancing (Advanced)
For high-traffic scenarios, modify `ecosystem.config.js`:
```javascript
{
  name: 'groow-backend',
  instances: 'max', // Use all CPU cores
  exec_mode: 'cluster'
}
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   ./start-pm2.sh stop
   ./start-pm2.sh development
   ```

2. **Build Failures**
   ```bash
   # Check backend build
   cd backend && npm run build
   
   # Check frontend build
   cd frontend && npm run build
   ```

3. **Memory Issues**
   - Check memory usage: `pm2 monit`
   - Adjust `max_memory_restart` in ecosystem.config.js

4. **Database Connection**
   - Check database is running
   - Verify environment variables
   - Check backend logs: `pm2 logs groow-backend`

### Log Locations
- Backend: `backend/logs/`
- Frontend Dev: `frontend/logs/frontend-dev-*.log`
- Frontend Static: `frontend/logs/frontend-static-*.log`
- PM2 Logs: `~/.pm2/logs/`

### Health Checks
- Backend Health: http://localhost:3001/api/v1/health
- Frontend: http://localhost:8001

## Security Notes

### Production Checklist
- [ ] Change default passwords in `.env`
- [ ] Use HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up log rotation
- [ ] Monitor resource usage
- [ ] Regular security updates

### Environment Variables
Ensure these are properly set for production:
- `NODE_ENV=production`
- `DATABASE_SYNC=false`
- `JWT_SECRET` (strong secret)
- `SESSION_SECRET` (strong secret)

## Support

For issues or questions:
1. Check logs: `pm2 logs`
2. Verify status: `pm2 status`
3. Monitor resources: `pm2 monit`
4. Review configuration: `ecosystem.config.js`