# Repository Structure Analysis

## 📁 File Organization

### **Frontend (React/TypeScript)**

Located in `/src/`

```
src/
├── components/          # Reusable UI components (shadcn/ui)
│   ├── ui/             # 49 UI components (buttons, cards, dialogs, etc.)
│   ├── Header.tsx      # Main navigation header
│   ├── PropertyCard.tsx # Property display card
│   ├── SearchBar.tsx    # Search functionality
│   ├── SignInButton.tsx # Authentication button
│   └── ...
├── pages/              # Route pages
│   ├── Index.tsx       # Landing page
│   ├── SearchResults.tsx # Property search results
│   ├── PropertyDetail.tsx # Property details
│   ├── Favorites.tsx   # User favorites
│   ├── Dashboard.tsx    # User dashboard
│   ├── SignIn.tsx      # Login page
│   └── ... (20+ pages)
├── services/           # API service layer
│   ├── authService.ts      # Authentication API calls
│   ├── propertyService.ts  # SimplyRETS API integration
│   ├── favoritesService.ts # Favorites CRUD
│   ├── purchaseService.ts  # Purchase workflow
│   ├── paymentService.ts   # Payment handling
│   ├── offerService.ts     # Offer management
│   └── ...
├── hooks/              # React hooks
│   ├── useAuth.tsx     # Authentication context
│   └── useProperties.ts # Property data fetching
└── types/              # TypeScript type definitions
```

### **Backend (Node.js/Express)**

Located in `/google-login-demo/`

```
google-login-demo/
├── server.js           # Main Express server
├── config/
│   └── passport.js     # Google OAuth configuration
├── db/
│   ├── index.js        # PostgreSQL connection pool
│   ├── schema.sql      # Database schema
│   └── init.js         # Schema initialization
├── middleware/
│   └── auth.js         # JWT & session authentication
├── routes/
│   ├── auth.js         # Google OAuth routes
│   ├── authLocal.js    # Username/password auth
│   ├── api.js          # General API endpoints
│   ├── favorites.js    # Favorites API
│   ├── purchases.js    # Purchase requests API
│   ├── offers.js       # Offers API
│   ├── documents.js    # Documents API
│   ├── payments.js     # Payments API
│   └── dashboard.js    # Dashboard data API
└── package.json        # Backend dependencies
```

---

## ✅ **What IS Implemented**

### **1. Authentication System**

- ✅ **Google OAuth 2.0** - Fully functional
  - Passport.js integration
  - Session management with secure cookies
  - Cross-origin cookie support (sameSite: "none" for production)
  - User creation/update in PostgreSQL
  - Account linking (Google + username/password)
- ✅ **Username/Password Auth** - Implemented
  - Registration with validation
  - Login with bcrypt password hashing
  - JWT token support (alongside sessions)
- ✅ **Session Management**
  - Express-session with PostgreSQL-compatible storage
  - Secure cookie configuration
  - CORS with credentials support

**Files:**

- `google-login-demo/config/passport.js` - OAuth strategy
- `google-login-demo/routes/auth.js` - OAuth routes
- `google-login-demo/routes/authLocal.js` - Local auth routes
- `google-login-demo/middleware/auth.js` - Auth middleware
- `src/services/authService.ts` - Frontend auth service
- `src/hooks/useAuth.tsx` - Auth React context

### **2. Database (PostgreSQL)**

- ✅ **Complete Schema** - All tables created
  - `users` - User accounts (OAuth + local)
  - `user_favorites` - Saved properties
  - `purchase_requests` - Buy Now workflow data
  - `offers` - Property offers
  - `documents` - Signed agreements
  - `payments` - Payment history
- ✅ **Database Connection**
  - Connection pooling with `pg`
  - SSL support for production
  - Automatic schema initialization
  - Migration support

**Files:**

- `google-login-demo/db/schema.sql` - Complete schema
- `google-login-demo/db/index.js` - Connection & utilities
- `google-login-demo/db/init.js` - Schema initialization

### **3. Property Management**

- ✅ **Property Search** - Functional
  - SimplyRETS API integration
  - Search by location, price, beds, baths, type
  - List view and swipe view modes
  - Filtering system
- ✅ **Property Details** - Basic implementation
  - Image gallery
  - Property information display
  - Placeholder for maps/video
- ✅ **Favorites System** - Database-backed
  - Add/remove favorites
  - Migration from localStorage to database
  - User-specific favorites

**Files:**

- `src/services/propertyService.ts` - SimplyRETS integration
- `src/pages/SearchResults.tsx` - Search UI
- `src/pages/PropertyDetail.tsx` - Detail page
- `src/pages/Favorites.tsx` - Favorites page
- `google-login-demo/routes/favorites.js` - Favorites API

### **4. Buy Now Workflow**

- ✅ **Representation Form** - UI complete
  - Form fields for buyer representation
  - Data stored in database
  - Placeholder for eSignature
- ✅ **Payment Page** - UI complete
  - Fixed fee ($299) display
  - À la carte service selection
  - Total calculation
  - **⚠️ NO ACTUAL PAYMENT PROCESSING** (simulated)
- ✅ **Payment Confirmation** - UI complete
- ✅ **Financing Selection** - Page exists
- ✅ **Offer Agreement Form** - UI exists
  - **⚠️ NO eSIGNATURE INTEGRATION**

**Files:**

- `src/pages/RepresentationForm.tsx`
- `src/pages/PaymentPage.tsx`
- `src/pages/PaymentConfirmation.tsx`
- `src/pages/FinancingSelection.tsx`
- `src/pages/OfferAgreementForm.tsx`
- `google-login-demo/routes/purchases.js` - Purchase API

### **5. User Dashboard**

- ✅ **Dashboard Summary** - Implemented
  - Favorites count
  - Purchases summary
  - Offers summary
  - Documents count
  - Payments summary
  - Recent purchases list
- ✅ **Dashboard Detail Pages** - Partially implemented
  - Offers list page exists
  - Documents page exists
  - Payments page exists
  - **⚠️ May need more functionality**

**Files:**

- `src/pages/Dashboard.tsx` - Main dashboard
- `src/pages/DashboardOffers.tsx` - Offers list
- `src/pages/DashboardDocuments.tsx` - Documents list
- `src/pages/DashboardPayments.tsx` - Payments list
- `google-login-demo/routes/dashboard.js` - Dashboard API

### **6. API Gateway / Backend Routes**

- ✅ **All Core Routes Implemented**
  - `/auth/*` - Authentication
  - `/api/auth/*` - Local authentication
  - `/api/favorites/*` - Favorites CRUD
  - `/api/purchases/*` - Purchase workflow
  - `/api/offers/*` - Offer management
  - `/api/documents/*` - Document management
  - `/api/payments/*` - Payment records
  - `/api/dashboard/*` - Dashboard data
  - `/health` - Health check

**Files:**

- `google-login-demo/server.js` - Main server with route mounting
- `google-login-demo/routes/*.js` - Individual route files

### **7. Frontend Infrastructure**

- ✅ **React Router** - All routes configured
- ✅ **React Query** - Data fetching & caching
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Styling
- ✅ **shadcn/ui** - Component library (49 components)

---

## ❌ **What is NOT Implemented**

### **1. Payment Processing (CRITICAL)**

- ❌ **Stripe Integration** - Not implemented
  - Payment page only simulates payment
  - No actual credit card processing
  - No webhook handling
  - No payment intent creation

**Impact:** Users cannot actually pay for services.

**What's Needed:**

- Install `stripe` package
- Create payment intent endpoint
- Integrate Stripe Elements in frontend
- Handle payment webhooks
- Update payment status in database

**Files to Update:**

- `src/pages/PaymentPage.tsx` - Add Stripe Elements
- `google-login-demo/routes/payments.js` - Add Stripe integration
- `google-login-demo/.env` - Add Stripe keys

### **2. eSignature Integration (HIGH PRIORITY)**

- ❌ **DocuSign/HelloSign** - Not implemented
  - Forms have placeholder checkboxes
  - No actual document signing
  - No signed document storage

**Impact:** Legal documents cannot be signed electronically.

**What's Needed:**

- Choose provider (DocuSign or HelloSign)
- Install SDK
- Create signature request endpoints
- Handle signature completion webhooks
- Store signed document URLs

**Files to Update:**

- `src/pages/RepresentationForm.tsx`
- `src/pages/OfferAgreementForm.tsx`
- `google-login-demo/routes/documents.js`

### **3. Email Notifications**

- ❌ **Email System** - Not implemented
  - No confirmation emails
  - No offer status updates
  - No payment confirmations

**Impact:** Users don't receive transaction confirmations.

**What's Needed:**

- Choose provider (SendGrid recommended)
- Install email library
- Create email templates
- Add email triggers to API routes

### **4. Property Detail Enhancements**

- ❌ **Google Maps** - Not implemented

  - Placeholder exists
  - No map display
  - No street view

- ❌ **Video Gallery** - Not implemented
  - Placeholder exists
  - No video player

### **5. Additional Workflows**

- ❌ **SELL NOW Workflow** - Not implemented

  - Button exists but no functionality

- ❌ **SWAP NOW Workflow** - Not implemented
  - Button exists but no functionality

### **6. Additional Authentication**

- ❌ **Facebook Login** - Not implemented
  - Only Google OAuth exists

### **7. Identity Verification**

- ❌ **Identity Check** - Not implemented
  - No verification step in offer workflow

### **8. Advanced Features**

- ❌ **Scheduled MLS Data Sync** - Not implemented
- ❌ **Email Notifications** - Not implemented
- ❌ **Offer Tracking System** - Basic structure exists, but no status updates from agents

---

## 🔍 **Where Errors May Lie**

### **1. Environment Variables**

**Risk:** Missing or incorrect environment variables

**Critical Variables:**

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Required for login
- `DATABASE_URL` - Required for database connection
- `SESSION_SECRET` - Required for secure sessions
- `FRONTEND_URL` / `BASE_URL` - Required for CORS and redirects
- `JWT_SECRET` - Required for JWT tokens

**Files:**

- `google-login-demo/.env` - Backend environment
- `env.example` - Frontend environment template
- `google-login-demo/env.example` - Backend environment template

**Common Issues:**

- Missing `DATABASE_URL` → Database connection fails
- Wrong `FRONTEND_URL` → CORS errors, cookie issues
- Missing `SESSION_SECRET` → Session security issues

### **2. Database Connection**

**Risk:** Database connection failures

**Potential Issues:**

- PostgreSQL not running
- Wrong connection string format
- SSL configuration issues (production)
- Database doesn't exist
- Schema not initialized

**Files:**

- `google-login-demo/db/index.js` - Connection logic
- `google-login-demo/db/schema.sql` - Schema definition

**Common Errors:**

- "Connection refused" → PostgreSQL not running
- "database does not exist" → Database not created
- "relation does not exist" → Schema not initialized

### **3. CORS Configuration**

**Risk:** Cross-origin request failures

**Current Setup:**

- CORS configured in `server.js`
- Allows credentials (cookies)
- Dynamic origin checking based on `FRONTEND_URL`

**Potential Issues:**

- `FRONTEND_URL` not set → All origins blocked in production
- Wrong URL format → Origin mismatch
- Cookie `sameSite` settings → Cookies not sent cross-origin

**Files:**

- `google-login-demo/server.js` (lines 40-104) - CORS configuration
- `google-login-demo/server.js` (lines 127-145) - Session cookie config

### **4. Authentication Flow**

**Risk:** Login failures, session issues

**Potential Issues:**

- Google OAuth callback URL mismatch
- Session cookies not being set (cross-origin)
- JWT token expiration
- Session secret mismatch

**Files:**

- `google-login-demo/config/passport.js` - OAuth callback URL
- `google-login-demo/routes/auth.js` - Auth routes
- `src/hooks/useAuth.tsx` - Frontend auth logic (has retry logic for cookies)

**Common Errors:**

- "OAuth client not found" → Wrong Google Client ID
- "Redirect URI mismatch" → Callback URL doesn't match Google Console
- "Not authenticated" → Session cookie not sent/received

### **5. SimplyRETS API Integration**

**Risk:** Property data not loading

**Current State:**

- Uses demo credentials as fallback
- Has multiple credential attempts
- Returns empty array if all fail

**Potential Issues:**

- API credentials not set
- API rate limiting
- Network connectivity
- API response format changes

**Files:**

- `src/services/propertyService.ts` - API integration
- `env.example` - API key configuration

### **6. Payment Processing (Simulated)**

**Risk:** Payments not actually processed

**Current State:**

- Payment page simulates payment with `setTimeout`
- No actual payment processing
- Payment data saved to database but not verified

**Files:**

- `src/pages/PaymentPage.tsx` (lines 148-191) - Simulated payment
- `src/services/purchaseService.ts` (lines 196-243) - Payment service

**Impact:** Users think they paid but no money is collected.

### **7. Database Schema Migrations**

**Risk:** Schema changes not applied

**Current State:**

- Schema initialization is idempotent (safe to run multiple times)
- Migration script exists for username/password columns

**Files:**

- `google-login-demo/db/schema.sql` - Main schema
- `google-login-demo/db/migrate_add_username_password.sql` - Migration

**Potential Issues:**

- Migration not run → Missing columns
- Schema out of sync → Database errors

### **8. Frontend-Backend Communication**

**Risk:** API calls failing

**Configuration:**

- Frontend uses `VITE_AUTH_SERVER_URL` or defaults to `localhost:3001`
- Backend must be running and accessible

**Files:**

- `src/services/*.ts` - All services use `getBaseUrl()` pattern
- `vite.config.ts` - Vite configuration

**Common Issues:**

- Backend not running → All API calls fail
- Wrong `VITE_AUTH_SERVER_URL` → Calls go to wrong server
- CORS blocking → Requests fail with CORS error

---

## 🏗️ **Architecture Overview**

### **Frontend → Backend Communication**

```
React App (localhost:5173)
    ↓ HTTP requests with credentials: "include"
    ↓
Express Server (localhost:3001)
    ↓
PostgreSQL Database
```

### **Authentication Flow**

```
User clicks "Sign in with Google"
    ↓
Frontend redirects to: /auth/google
    ↓
Backend redirects to Google OAuth
    ↓
Google redirects back to: /auth/google/callback
    ↓
Backend creates session, redirects to frontend with ?auth=success
    ↓
Frontend checks /api/me to get user data
    ↓
Session cookie sent with all subsequent requests
```

### **Database Schema Relationships**

```
users
  ├── user_favorites (user_id)
  ├── purchase_requests (user_id)
  │   └── offers (purchase_request_id)
  │   └── documents (purchase_request_id)
  │   └── payments (purchase_request_id)
  └── documents (user_id)
  └── payments (user_id)
```

---

## 🚨 **Critical Missing Features for Production**

1. **Stripe Payment Integration** - Users cannot pay
2. **eSignature Integration** - Legal documents cannot be signed
3. **Email Notifications** - No transaction confirmations
4. **Google Maps** - Property locations not shown
5. **Error Handling** - Some error cases may not be handled gracefully

---

## 📝 **Recommendations**

### **Immediate Actions:**

1. **Set up environment variables** - Check all `.env` files are configured
2. **Test database connection** - Verify PostgreSQL is accessible
3. **Test authentication flow** - Ensure Google OAuth works end-to-end
4. **Implement Stripe** - Critical for revenue
5. **Implement eSignature** - Legal requirement

### **Testing Checklist:**

- [ ] Database connection works
- [ ] Google OAuth login works
- [ ] Session cookies are set correctly
- [ ] API endpoints return correct data
- [ ] CORS allows frontend requests
- [ ] Property search returns results
- [ ] Favorites are saved to database
- [ ] Purchase workflow saves data correctly

---

**Last Updated:** Based on current repository state
**Status:** Core features implemented, payment and eSignature missing
