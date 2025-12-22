# Next Steps Roadmap - MVP Implementation Plan

Based on the MVP specifications and current implementation status, this document outlines what needs to be done to complete the MVP.

## 📊 Current Status Summary

### ✅ **Fully Implemented**

- Main page with banner, search, featured homes carousel
- Search results with list/swipe toggle
- Favorites/liked homes with database persistence
- Property detail page (basic - missing maps/video)
- Standard pages (Privacy, Terms, Contact, About, Help)
- Google OAuth authentication
- User dashboard (summary view)
- Buy Now workflow (representation form, payment page, confirmation)
- PostgreSQL database with all necessary tables
- Backend API routes for favorites, purchases, offers, dashboard

### ⚠️ **Partially Implemented**

- Dashboard (summary exists, detailed views missing)
- Payment processing (UI ready, Stripe integration pending)
- eSignature (placeholder forms ready, DocuSign/HelloSign integration pending)
- Offer workflow (database structure exists, UI/flow incomplete)

### ❌ **Not Implemented**

- Facebook login
- Google Maps integration on property detail
- Video gallery integration
- SELL NOW workflow
- SWAP NOW workflow
- Offer agreement form with eSignature
- Identity verification
- Email notifications
- Offer tracking system (status updates)
- Financing options UI (cash/loan selection)
- Scheduled MLS data sync
- Payment processing (Stripe)
- eSignature integration (DocuSign/HelloSign)

---

## 🎯 Priority 1: Critical MVP Features

### 1. Complete Buy Now Workflow - Offer Submission

**Current State**: Payment confirmation page exists, but offer submission is missing.

**What's Needed**:

- [ ] **Financing Selection Page** (`/property/:id/financing`)

  - Radio buttons: Cash, Loan, Apply for Loan
  - Store selection in database
  - Navigate to offer form based on selection

- [ ] **Offer Agreement Form** (`/property/:id/offer`)

  - Pre-populate with user info from representation form
  - Include: offer amount, contingencies, closing date, financing type
  - eSignature placeholder (DocuSign/HelloSign integration)
  - Submit offer button

- [ ] **Offer Submission API** (`/api/offers`)

  - Create offer record in database
  - Set status to 'submitted'
  - Link to purchase_request
  - Return offer ID

- [ ] **Offer Confirmation Page** (`/property/:id/offer/confirmation`)
  - Show submitted offer details
  - Next steps information
  - Link back to dashboard

**Database**: Already supports this (offers table has all necessary fields)

**Estimated Time**: 2-3 days

---

### 2. Dashboard Detailed Views

**Current State**: Dashboard shows summary counts, but no detailed views.

**What's Needed**:

- [ ] **Offers List View** (`/dashboard/offers`)

  - Table/list of all user offers
  - Show: property address, offer amount, status, date
  - Status badges (submitted, accepted, rejected, withdrawn)
  - Link to offer detail page
  - Filter by status

- [ ] **Documents List View** (`/dashboard/documents`)

  - List of signed documents
  - Document type, signing date, download link
  - Filter by document type

- [ ] **Payment History View** (`/dashboard/payments`)

  - Transaction history table
  - Amount, date, status, receipt download
  - Filter by date range

- [ ] **Backend API Endpoints**:
  - `GET /api/dashboard/offers` - Get all user offers
  - `GET /api/dashboard/documents` - Get all user documents
  - `GET /api/dashboard/payments` - Get payment history

**Estimated Time**: 2-3 days

---

### 3. Email Notifications System

**Current State**: No email notification system exists.

**What's Needed**:

- [ ] **Email Service Setup**

  - Choose email provider (SendGrid, Mailgun, AWS SES, or Nodemailer with SMTP)
  - Install email library (`nodemailer` or provider SDK)
  - Configure environment variables (API keys, SMTP settings)

- [ ] **Email Templates**

  - Payment confirmation email
  - Offer submitted email
  - Offer status update email (accepted/rejected)
  - Representation form signed confirmation

- [ ] **Email Triggers**:

  - After payment completion → Send payment confirmation
  - After offer submission → Send offer submitted confirmation
  - When offer status changes → Send update email (future: agent updates status)

- [ ] **Backend Integration**:
  - Create `services/emailService.js`
  - Add email sending to relevant endpoints:
    - `/api/purchases/:id/payment` - Payment confirmation
    - `/api/offers` (POST) - Offer submitted
    - `/api/offers/:id/status` (PUT) - Status update

**Recommended**: Start with SendGrid (free tier: 100 emails/day)

**Estimated Time**: 2-3 days

---

## 🎯 Priority 2: Enhanced User Experience

### 4. Offer Tracking System

**Current State**: Offers table has status field, but no tracking UI.

**What's Needed**:

- [ ] **Offer Status Tracking Page** (`/offer/:id/tracking`)

  - Timeline view of offer status
  - Current status display
  - Status history (when status changed, who changed it)
  - Agent response section (when available)

- [ ] **Status Update API** (`PUT /api/offers/:id/status`)

  - Update offer status
  - Store status change history
  - Send email notification (if implemented)

- [ ] **Real-time Updates** (Optional - Phase 2):
  - WebSocket or polling for status updates
  - Push notifications (browser notifications)

**Database Enhancement**: Add `offer_status_history` table:

```sql
CREATE TABLE offer_status_history (
  id SERIAL PRIMARY KEY,
  offer_id VARCHAR(255) REFERENCES offers(id),
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by VARCHAR(255), -- 'user' or 'agent' or system
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Estimated Time**: 2-3 days

---

### 5. Google Maps Integration

**Current State**: Property detail page has placeholder for maps.

**What's Needed**:

- [ ] **Install Google Maps Library**

  - `@react-google-maps/api` or `@googlemaps/js-api-loader`
  - Add Google Maps API key to environment variables

- [ ] **Map Component** (`src/components/PropertyMap.tsx`)

  - Display property location on map
  - Marker at property address
  - Optional: Show nearby properties

- [ ] **Street View Component** (`src/components/StreetView.tsx`)

  - Embedded Street View
  - Toggle between map and street view

- [ ] **Integration in PropertyDetail.tsx**
  - Replace placeholder with actual map component
  - Handle loading states
  - Error handling if API key missing

**Cost**: Google Maps API has free tier (first $200/month free)

**Estimated Time**: 1-2 days

---

### 6. Video Gallery Integration

**Current State**: Property detail has video section placeholder.

**What's Needed**:

- [ ] **Video Player Component**

  - Support for YouTube, Vimeo, or direct video URLs
  - Thumbnail gallery if multiple videos
  - Lazy loading

- [ ] **Video Data Structure**

  - Add `videos` array to Property type
  - Support multiple video sources

- [ ] **Integration in PropertyDetail.tsx**
  - Replace placeholder with video player
  - Handle cases where no video exists

**Estimated Time**: 1 day

---

## 🎯 Priority 3: Payment & eSignature Integration

### 7. Stripe Payment Integration

**Current State**: Payment page exists, but no actual payment processing.

**What's Needed**:

- [ ] **Stripe Account Setup**

  - Create Stripe account
  - Get API keys (test and production)
  - Configure webhook endpoint

- [ ] **Backend Integration**

  - Install `stripe` package
  - Create payment intent API endpoint
  - Handle payment confirmation webhook
  - Update purchase_requests table with payment status

- [ ] **Frontend Integration**

  - Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
  - Add Stripe Elements to payment page
  - Handle payment submission
  - Show success/error states

- [ ] **PCI Compliance**: Stripe handles PCI compliance (no card data touches your server)

**Estimated Time**: 3-4 days

---

### 8. eSignature Integration (DocuSign or HelloSign)

**Current State**: Forms exist, but no actual eSignature integration.

**What's Needed**:

- [ ] **Choose Provider**: DocuSign or HelloSign

  - DocuSign: More features, higher cost
  - HelloSign: Simpler, lower cost, Dropbox-owned

- [ ] **Backend Integration**

  - Install provider SDK
  - Create envelope/document API endpoint
  - Handle webhook for signed documents
  - Store signed document URL in database

- [ ] **Frontend Integration**

  - Embed signing experience or redirect to provider
  - Handle callback after signing
  - Show signing status

- [ ] **Document Templates**
  - Representation Agreement template
  - Offer Agreement template
  - Upload/configure templates in provider dashboard

**Recommended**: HelloSign (easier to integrate, better developer experience)

**Estimated Time**: 4-5 days

---

## 🎯 Priority 4: Additional Features

### 9. Identity Verification

**Current State**: Not implemented.

**What's Needed**:

- [ ] **Choose Provider**:

  - Jumio (popular for real estate)
  - Onfido
  - Stripe Identity (if using Stripe)

- [ ] **Integration**:
  - Add identity verification step in offer workflow
  - Capture verification status in database
  - Block offer submission until verified

**Estimated Time**: 3-4 days (depends on provider)

---

### 10. Facebook Login

**Current State**: Only Google OAuth implemented.

**What's Needed**:

- [ ] **Facebook Developer Setup**

  - Create Facebook App
  - Configure OAuth settings
  - Add redirect URIs

- [ ] **Backend Integration**

  - Install `passport-facebook` package
  - Add Facebook strategy to Passport config
  - Update routes to support Facebook

- [ ] **Frontend Integration**
  - Add Facebook login button
  - Handle OAuth flow similar to Google

**Estimated Time**: 1-2 days

---

### 11. SELL NOW Workflow

**Current State**: Button exists, but no workflow.

**What's Needed**:

- [ ] **Seller Onboarding Form**

  - Property details form
  - Photos upload
  - Pricing information
  - Contact preferences

- [ ] **Database Schema**:

  ```sql
  CREATE TABLE seller_listings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id),
    property_address TEXT,
    property_details JSONB,
    photos TEXT[],
    asking_price DECIMAL(10, 2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [ ] **Backend API**: Create endpoints for seller listings
- [ ] **Frontend**: Create seller workflow pages

**Estimated Time**: 5-7 days (similar complexity to Buy Now)

---

### 12. SWAP NOW Workflow

**Current State**: Button exists, but no workflow.

**What's Needed**:

- [ ] **Swap Request Form**

  - Current property details
  - Desired property criteria
  - Equity information
  - Timeline

- [ ] **Database Schema**:

  ```sql
  CREATE TABLE swap_requests (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id),
    current_property_id VARCHAR(255),
    desired_criteria JSONB,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [ ] **Backend API**: Create endpoints for swap requests
- [ ] **Frontend**: Create swap workflow pages

**Estimated Time**: 5-7 days

---

## 🎯 Priority 5: Backend Infrastructure

### 13. Scheduled MLS Data Sync

**Current State**: No automated data sync.

**What's Needed**:

- [ ] **Choose Scheduler**:

  - `node-cron` (simple, in-process)
  - Bull Queue + Redis (more robust, requires Redis)
  - External cron service (EasyCron, cron-job.org)

- [ ] **Sync Job**:

  - Fetch data from SimplyRETS API
  - Compare with existing data
  - Update/insert properties
  - Log changes

- [ ] **Error Handling**:
  - Retry logic
  - Alerts on failure
  - Data validation

**Recommended**: Start with `node-cron`, migrate to Bull Queue if needed

**Estimated Time**: 3-4 days

---

### 14. Enhanced Monitoring & Logging

**Current State**: Basic health check exists.

**What's Needed**:

- [ ] **Application Logging**:

  - Use `winston` or `pino` for structured logging
  - Log levels (error, warn, info, debug)
  - Request/response logging middleware

- [ ] **Error Tracking**:

  - Integrate Sentry or similar
  - Track errors in production
  - Get alerts on critical errors

- [ ] **Performance Monitoring**:
  - Add response time logging
  - Monitor database query performance
  - Track API endpoint usage

**Estimated Time**: 2-3 days

---

## 📅 Recommended Implementation Order

### **Week 1-2: Critical MVP Features**

1. Complete Buy Now Workflow - Offer Submission (Priority 1.1)
2. Dashboard Detailed Views (Priority 1.2)
3. Email Notifications System (Priority 1.3)

### **Week 3-4: Enhanced UX**

4. Offer Tracking System (Priority 2.4)
5. Google Maps Integration (Priority 2.5)
6. Video Gallery Integration (Priority 2.6)

### **Week 5-6: Payment & Signatures**

7. Stripe Payment Integration (Priority 3.7)
8. eSignature Integration (Priority 3.8)

### **Week 7+: Additional Features**

9. Identity Verification (Priority 4.9)
10. Facebook Login (Priority 4.10)
11. SELL NOW Workflow (Priority 4.11)
12. SWAP NOW Workflow (Priority 4.12)
13. Scheduled MLS Data Sync (Priority 5.13)
14. Enhanced Monitoring (Priority 5.14)

---

## 🔧 Technical Debt to Address

### Database Schema Fixes

- [ ] Fix missing `id` field in documents table (line 56 in schema.sql shows incomplete)
- [ ] Add `facebook_id` to users table for Facebook OAuth
- [ ] Add `email_verified` field to users table
- [ ] Consider adding `properties` table for MLS data caching

### Code Quality

- [ ] Migrate `purchaseService.ts` from localStorage to database API
- [ ] Add proper TypeScript types for all API responses
- [ ] Add input validation to all API endpoints
- [ ] Add unit tests for critical functions
- [ ] Add integration tests for API endpoints

### Security

- [ ] Implement rate limiting on API endpoints
- [ ] Add input sanitization
- [ ] Review and enhance JWT token security
- [ ] Implement CSRF protection
- [ ] Add API request logging for audit trail

---

## 📝 Notes

- **MVP Focus**: According to the spec, the MVP should be "functional with basic info" and allow users to "submit an offer"
- **Design Priority**: Spec emphasizes design is important, but we have shadcn/ui which provides good baseline
- **Scalability**: Spec says scalability is less important for MVP - focus on functionality over performance optimization
- **Testing**: Ensure core user flows work end-to-end before adding advanced features

---

## 🚀 Quick Wins (Do First)

These can be implemented quickly and provide immediate value:

1. **Fix database schema** (30 min)
2. **Add offer submission UI** (1 day)
3. **Add dashboard detailed views** (2 days)
4. **Set up basic email notifications** (1 day)
5. **Add Google Maps** (1 day)

**Total Quick Wins Time**: ~5 days

---

## 📞 Next Actions

1. Review and prioritize this roadmap
2. Set up development environment for new features
3. Create feature branches for each priority item
4. Start with Quick Wins for momentum
5. Set up external service accounts (Stripe, DocuSign/HelloSign, SendGrid, etc.)
