# 🚀 Cloud Deployment Guide: Vercel + Railway

## Overview
This guide covers deploying the Groow e-commerce platform to the cloud:
- **Frontend**: Vercel (Static React/UmiJS hosting)
- **Backend**: Railway (Node.js with PostgreSQL + Redis)

## ✅ Yes, Railway has excellent backend support!
Railway supports:
- ✅ Node.js/NestJS applications
- ✅ PostgreSQL databases  
- ✅ Redis caching
- ✅ Environment variables
- ✅ Custom domains
- ✅ Auto-scaling
- ✅ CI/CD from GitHub

---

## 🎯 Quick Deploy Commands

### Deploy Backend to Railway
```bash
./deploy-railway.sh
```

### Deploy Frontend to Vercel  
```bash
./deploy-vercel.sh
```

---

## 📋 Step-by-Step Deployment

### 1. Backend Deployment (Railway)

#### Prerequisites
- Railway account: https://railway.app
- GitHub repository connected

#### Deploy Steps
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy backend
cd backend
railway up

# 4. Add PostgreSQL database
railway add --database postgresql

# 5. Add Redis (optional)  
railway add --database redis

# 6. Set environment variables
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set ADMIN_PASSWORD=$(openssl rand -base64 16)
```

#### Auto-Generated Environment Variables (Railway provides):
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string  
- `RAILWAY_ENVIRONMENT` - deployment environment
- `PORT` - application port

### 2. Frontend Deployment (Vercel)

#### Prerequisites  
- Vercel account: https://vercel.com
- GitHub repository connected

#### Deploy Steps
```bash
# 1. Install/Update Vercel CLI
npm install -g vercel@latest

# 2. Build frontend
cd frontend
npm run build

# 3. Deploy to Vercel
vercel --prod
```

#### Environment Variables (Set in Vercel Dashboard):
- `NODE_ENV=production`
- `REACT_APP_API_URL=https://your-railway-app.up.railway.app`

---

## 🔧 Configuration Files Created

### Backend (Railway)
- `backend/railway.json` - Railway deployment config
- `backend/Dockerfile.railway` - Container configuration  
- `backend/.env.railway` - Environment template
- `deploy-railway.sh` - Deployment script

### Frontend (Vercel)
- `frontend/vercel.json` - Vercel deployment config
- `deploy-vercel.sh` - Deployment script

---

## 🌐 Expected URLs After Deployment

### Backend (Railway)
- **API**: `https://groow-backend-production.up.railway.app`
- **Health Check**: `https://groow-backend-production.up.railway.app/api/v1/health`
- **API Docs**: `https://groow-backend-production.up.railway.app/api/docs`

### Frontend (Vercel)  
- **Website**: `https://groow-frontend.vercel.app`
- **Custom Domain**: Can be configured in Vercel dashboard

---

## ⚙️ Environment Configuration

### Railway Backend Environment
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${DATABASE_URL}          # Auto-provided
REDIS_URL=${REDIS_URL}                # Auto-provided  
JWT_SECRET=${JWT_SECRET}              # Set manually
SESSION_SECRET=${SESSION_SECRET}      # Set manually
FRONTEND_URL=https://groow-frontend.vercel.app
CORS_ORIGINS=https://groow-frontend.vercel.app,https://groow.destinpq.com
```

### Vercel Frontend Environment
```env
NODE_ENV=production
REACT_APP_API_URL=https://groow-backend-production.up.railway.app
```

---

## 🔄 Automatic Deployments

### GitHub Integration
Both platforms support automatic deployments:

**Railway**: 
- Connects to GitHub repository
- Auto-deploys on push to main branch
- Environment-specific branches supported

**Vercel**:
- Auto-deploys on push to main branch  
- Preview deployments for pull requests
- Custom domains and SSL included

---

## 📊 Monitoring & Logs

### Railway Backend Monitoring
```bash
# View logs
railway logs

# Check status
railway status  

# Open dashboard
railway open
```

### Vercel Frontend Monitoring
- Access Vercel dashboard for analytics
- Real-time function logs
- Performance metrics included

---

## 🛡️ Security Checklist

### Production Security
- ✅ Environment variables secured
- ✅ CORS properly configured  
- ✅ HTTPS enforced
- ✅ Database connections secured
- ✅ JWT secrets generated securely
- ✅ File upload restrictions in place

### Database Security (Railway)
- ✅ PostgreSQL with SSL
- ✅ Connection pooling
- ✅ Automatic backups
- ✅ Private networking

---

## 💰 Pricing Overview

### Railway (Backend + Database)
- **Starter**: $5/month per service
- **Pro**: $20/month (higher limits)
- PostgreSQL and Redis included
- Pay for usage beyond limits

### Vercel (Frontend)
- **Hobby**: Free (personal projects)
- **Pro**: $20/month per user
- Unlimited bandwidth on Pro
- Custom domains included

---

## 🚨 Troubleshooting

### Common Issues

1. **Railway Deployment Fails**
   ```bash
   # Check logs
   railway logs
   
   # Verify environment variables
   railway variables
   
   # Redeploy
   railway up --detach
   ```

2. **Vercel Build Fails**
   ```bash
   # Test build locally
   cd frontend && npm run build
   
   # Check build logs in Vercel dashboard
   # Verify environment variables
   ```

3. **CORS Issues**
   - Verify CORS_ORIGINS in Railway
   - Check frontend API_URL configuration
   - Ensure HTTPS in production

4. **Database Connection Issues**
   ```bash
   # Check DATABASE_URL in Railway
   railway variables
   
   # Verify database is running
   railway status
   ```

---

## 🎉 Success Checklist

After deployment, verify:
- ✅ Backend health check responds: `/api/v1/health`
- ✅ Frontend loads successfully
- ✅ API calls work from frontend
- ✅ Database connections established
- ✅ Authentication flows work
- ✅ File uploads functional
- ✅ Admin panel accessible

---

## 🔄 Updates & Maintenance

### Updating Deployments
```bash
# Backend update (Railway)
git push origin main  # Auto-deploys

# Frontend update (Vercel)  
git push origin main  # Auto-deploys

# Manual redeploy
railway up            # Railway
vercel --prod         # Vercel
```

### Database Migrations
```bash
# Run migrations on Railway
railway run npm run migration:run
```

---

## 🎯 Next Steps

1. **Deploy Backend**: Run `./deploy-railway.sh`
2. **Deploy Frontend**: Run `./deploy-vercel.sh`  
3. **Configure Domains**: Set up custom domains
4. **Monitor**: Set up monitoring and alerts
5. **Scale**: Configure auto-scaling as needed

Your Groow platform will be live and scalable in the cloud! 🚀