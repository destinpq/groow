# Groow Platform - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

### Initial Setup

1. **Clone and Install:**
```bash
cd /Users/pratik/Desktop/Work/DestinPQ/Groow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Database Setup:**
```bash
# Create database
createdb groow_db

# Run migrations and seed data
cd backend
npm run migration:run
npm run seed
```

3. **Start Development Servers:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
# Backend running on https://groow-api-db.destinpq.com
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend running on http://localhost:8000
```

---

## 🎯 Integrated Features (Phase 2 Complete)

### Admin Portal
**Login:** Navigate to `/admin/login`
- **Email:** admin@groow.com
- **Password:** admin123

**Available Pages:**
1. **Dashboard** - `/admin/dashboard`
   - Revenue analytics
   - Order statistics
   - Product metrics
   - Customer data

2. **Products** - `/admin/products`
   - View all products
   - Create new products
   - Edit existing products
   - Delete products
   - Search and filter

3. **Categories** - `/admin/categories`
   - Manage product categories
   - Create/edit/delete categories
   - Upload category images

4. **Brands** - `/admin/brands`
   - Manage brands
   - Create/edit/delete brands
   - Upload brand logos

5. **Orders** - `/admin/orders`
   - View all orders
   - Update order status (6 statuses)
   - View order details
   - See customer information
   - Track order timeline

### Vendor Portal
**Login:** Navigate to `/vendor/login`
- **Email:** vendor@groow.com
- **Password:** vendor123

**Available Pages:**
1. **Dashboard** - `/vendor/dashboard`
   - Revenue statistics
   - Product performance
   - Order metrics
   - Customer ratings
   - Sales charts (line & pie)
   - Recent orders table
   - Quick action cards

### Customer Portal
**Login:** Navigate to `/customer/login`
- **Email:** customer@groow.com
- **Password:** customer123

**Available Pages:**
1. **Dashboard** - `/customer/dashboard`
   - Active orders count
   - Order history (3 most recent)
   - Product recommendations
   - Account statistics

2. **Shopping Cart** - `/cart`
   - View cart items
   - Update quantities
   - Remove items
   - See order total
   - Proceed to checkout

3. **Checkout** - `/checkout`
   - Select shipping address
   - Choose payment method
   - Review order
   - Place order
   - Order confirmation

---

## 📊 API Endpoints Used

### Orders API (`/api/orders`)
```typescript
// Get all orders
ordersAPI.getAll({ page: 1, limit: 10 })

// Update order status
ordersAPI.updateStatus(orderId, 'shipped')

// Get single order
ordersAPI.getById(orderId)
```

### Products API (`/api/products`)
```typescript
// Get all products
productAPI.getAll({ page: 1, limit: 10 })

// Get featured products
productAPI.getFeatured()

// Create product
productAPI.create(productData)

// Update product
productAPI.update(productId, productData)

// Delete product
productAPI.delete(productId)
```

### Categories API (`/api/categories`)
```typescript
// Get all categories
categoryAPI.getAll()

// Create category
categoryAPI.create(categoryData)

// Update category
categoryAPI.update(categoryId, categoryData)

// Delete category
categoryAPI.delete(categoryId)
```

### Brands API (`/api/brands`)
```typescript
// Get all brands
brandAPI.getAll()

// Create brand
brandAPI.create(brandData)

// Update brand
brandAPI.update(brandId, brandData)

// Delete brand
brandAPI.delete(brandId)
```

### Vendor API (`/api/vendors`)
```typescript
// Get vendor statistics
vendorAPI.getStats()
```

### Cart API (`/api/cart`)
```typescript
// Add to cart
cartAPI.addItem(productId, quantity)

// Update quantity
cartAPI.updateQuantity(itemId, quantity)

// Remove item
cartAPI.removeItem(itemId)

// Get cart
cartAPI.getCart()
```

---

## 🧪 Testing the Features

### Test Shopping Flow
1. **Browse Products:**
   - Navigate to `/products`
   - Click on a product
   - Click "Add to Cart"

2. **View Cart:**
   - Click cart icon in header
   - Update quantities
   - Remove items if needed

3. **Checkout:**
   - Click "Proceed to Checkout"
   - Select shipping address
   - Choose payment method
   - Review order
   - Click "Place Order"
   - See confirmation

4. **Track Order:**
   - Go to Customer Dashboard
   - See order in recent orders
   - Click "View" to see details

### Test Admin Functions
1. **Manage Orders:**
   - Login as admin
   - Go to `/admin/orders`
   - See all orders from all customers
   - Click status dropdown
   - Change order status (e.g., pending → confirmed)
   - See success message

2. **Manage Products:**
   - Go to `/admin/products`
   - Click "New Product"
   - Fill in product details
   - Upload images
   - Set category and brand
   - Click "Submit"
   - See product in list

3. **View Analytics:**
   - Go to `/admin/dashboard`
   - See revenue charts
   - View order statistics
   - Check product metrics

### Test Vendor Features
1. **View Dashboard:**
   - Login as vendor
   - See revenue statistics
   - View sales charts
   - Check recent orders
   - See product performance

2. **Quick Actions:**
   - Click "Add New Product" card
   - Navigate to product creation
   - Click "Process Orders" card
   - Navigate to orders page

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend won't start
```bash
# Check if PostgreSQL is running
pg_isready

# Check if port 3001 is available
lsof -i :3001

# Restart backend
cd backend
npm run start:dev
```

**Problem:** Database connection error
```bash
# Verify database exists
psql -l | grep groow_db

# Create if missing
createdb groow_db

# Run migrations
npm run migration:run
```

**Problem:** No data in database
```bash
# Run seed script
cd backend
npm run seed
```

### Frontend Issues

**Problem:** Frontend won't start
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules
npm install
npm start
```

**Problem:** API calls failing
- Check backend is running on port 3001
- Check browser console for CORS errors
- Verify you're logged in (check auth token)

**Problem:** TypeScript errors
```bash
# Check for compilation errors
npm run tsc

# Restart dev server
npm start
```

### Common Issues

**Problem:** Cart not persisting
- Check localStorage in browser dev tools
- Clear localStorage and try again
- Verify cart store is properly configured

**Problem:** Can't login
- Use default credentials (see above)
- Check backend logs for authentication errors
- Verify JWT secret is configured

**Problem:** Images not loading
- Check uploads folder exists: `backend/uploads`
- Verify file permissions
- Check image URLs in database

---

## 📁 Project Structure

```
Groow/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── brands/
│   │   │   ├── cart/
│   │   │   └── vendors/
│   │   ├── config/         # Configuration
│   │   └── database/       # Database migrations
│   ├── uploads/            # Uploaded files
│   └── package.json
│
├── frontend/               # UmiJS frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages (5 pages)
│   │   │   ├── vendor/    # Vendor pages (1 page)
│   │   │   ├── customer/  # Customer pages (1 page)
│   │   │   ├── cart/      # Cart page
│   │   │   └── checkout/  # Checkout page
│   │   ├── services/      # API services
│   │   ├── stores/        # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   └── components/    # Reusable components
│   └── package.json
│
├── INTEGRATION_STATUS.md           # Current integration status
├── PHASE_2_COMPLETION_SUMMARY.md   # Detailed completion report
└── QUICK_START_GUIDE.md            # This file
```

---

## 📊 Database Schema

### Key Tables

**users**
- id, email, password, role (admin/vendor/customer)

**products**
- id, name, description, price, categoryId, brandId, images

**categories**
- id, name, description, image, parentId

**brands**
- id, name, description, logo

**orders**
- id, orderNumber, customerId, vendorId, status, total

**order_items**
- id, orderId, productId, quantity, price

**cart**
- id, userId

**cart_items**
- id, cartId, productId, quantity

---

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=groow_db
JWT_SECRET=your_jwt_secret
PORT=3001
```

### Frontend (.env)
```env
API_URL=https://groow-api-db.destinpq.com
```

---

## 📈 Current Status

### Phase 2: 100% Complete ✅
- ✅ 16 pages integrated
- ✅ 25+ API endpoints connected
- ✅ Zero compilation errors
- ✅ Full shopping flow working
- ✅ Admin portal functional
- ✅ Vendor dashboard live
- ✅ Customer dashboard operational

### Remaining Work
- 127 pages not yet integrated (88.8%)
- RFQ system
- Reviews & ratings
- Notifications
- Advanced analytics
- Wishlist
- Wallet integration

---

## 🆘 Need Help?

### Documentation
- `INTEGRATION_STATUS.md` - Current integration status
- `PHASE_2_COMPLETION_SUMMARY.md` - Detailed completion report
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation

### Quick Commands

**Start everything:**
```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm start
```

**Reset database:**
```bash
cd backend
npm run migration:revert
npm run migration:run
npm run seed
```

**Check logs:**
```bash
# Backend logs
cd backend
npm run start:dev

# Frontend logs
cd frontend
npm start
```

---

## ✨ Tips & Best Practices

1. **Always start backend before frontend**
2. **Check browser console for errors**
3. **Use default credentials for testing**
4. **Clear cache if seeing stale data**
5. **Check network tab for API responses**
6. **Verify you're logged in with correct role**
7. **Use backend logs to debug API issues**

---

**Last Updated:** December 2024  
**Phase 2 Status:** ✅ COMPLETE  
**Next Phase:** Phase 3 - Advanced Features
