# Two-Sided Platform Guide

## Overview
This application now supports a two-sided platform with separate interfaces for **Vendors** and **Goldman Sachs team members**.

## Platform Purpose
- **Replaces**: Ariba and KY3P systems
- **Goal**: Single unified onboarding platform
- **Time Reduction**: From 6 months to 2 weeks

## User Flows

### 🏢 Vendor Side

#### Landing Page (/)
- Choose "I'm a Vendor" to start onboarding process

#### Vendor Registration (/vendor/register)
- Sign up with company information
- Provide EIN, contact details, address

#### Document Upload (/vendor/upload)
- Upload required compliance documents:
  - W-9 Form
  - Insurance Certificate
  - Business License
- AI-powered verification with AWS Textract
- Real-time processing status

#### KY3P Questionnaire (/vendor/questionnaire)
Comprehensive assessment replacing traditional KY3P process:
1. **Company Information**
   - Business description
   - Years in business
   - Employee count
   - Annual revenue

2. **Compliance & Legal**
   - Certifications (ISO 27001, SOC 2, GDPR, etc.)
   - Data privacy compliance
   - Sanctions screening procedures
   - Litigation history

3. **Cybersecurity**
   - Security certifications
   - Incident response plan
   - Data encryption standards
   - Access controls

4. **Financial & Operations**
   - Financial health assessment
   - Insurance coverage details
   - Backup & recovery procedures

5. **ESG & Sustainability**
   - ESG policies
   - Diversity initiatives
   - Environmental commitments

#### Vendor Dashboard (/vendor/dashboard)
- Track onboarding progress
- View document verification status
- Monitor risk assessment
- Recent activity timeline

---

### 🏦 Goldman Sachs Side

#### GS Login (/gs/login)
- Secure authentication for GS team members
- Use @gs.com email addresses (demo mode accepts any @gs.com email)

#### GS Dashboard (/gs/dashboard)
- View all vendor submissions
- Filter by status: All, Pending, Approved, Rejected
- Search vendors by name or email
- Statistics overview:
  - Total vendors
  - Pending review count
  - Approved count
  - Rejected count

#### Vendor Detail Page (/gs/vendor/:vendorId)
Four comprehensive tabs:

1. **Overview**
   - Complete company information
   - Contact details
   - Submission dates

2. **Documents**
   - All uploaded documents
   - Download capability
   - Verification status

3. **KY3P Questionnaire**
   - All questionnaire responses
   - Compliance certifications
   - Security measures
   - Financial information
   - ESG initiatives

4. **Risk Assessment**
   - Overall risk score
   - Category breakdown (Financial, Cyber, Compliance)
   - AI analysis summary
   - Risk level indicators

#### Actions Available
- ✓ Approve Vendor
- ✗ Reject Vendor  
- 📧 Request More Information

---

## Technical Implementation

### New Components
- `KY3PQuestionnaire.jsx` - Comprehensive vendor questionnaire form
- `VendorQuestionnairePage.jsx` - Page wrapper for questionnaire
- `GSDashboardPage.jsx` - GS team vendor list view
- `GSVendorDetailPage.jsx` - Detailed vendor review page
- `GSLoginPage.jsx` - GS team authentication

### Updated Components
- `HomePage.jsx` - Two-sided entry point with user type selection
- `App.jsx` - Enhanced routing for vendor and GS paths
- `Navbar.jsx` - Context-aware navigation for different user types
- `DashboardPage.jsx` - Vendor-specific dashboard
- `UploadPage.jsx` - Updated navigation flow
- `RegisterPage.jsx` - Updated routing paths

### Mock Data
Added `mockVendors` array with 8 sample vendors showing different statuses for testing GS dashboard

### Routing Structure

```
Public Routes:
  / - Landing page with user type selection

Vendor Routes:
  /vendor/register - Vendor registration
  /vendor/upload - Document upload
  /vendor/questionnaire - KY3P questionnaire
  /vendor/dashboard - Vendor dashboard
  /vendor/risk - Risk score view

Goldman Sachs Routes:
  /gs/login - Team member login
  /gs/dashboard - Vendor management dashboard
  /gs/vendor/:vendorId - Detailed vendor review

Legacy Routes (redirects):
  /register → /vendor/register
  /upload → /vendor/upload
  /dashboard → /vendor/dashboard
  /risk → /vendor/risk
```

## Key Features

### For Vendors
- ✅ Single onboarding platform
- ✅ AI-powered document verification
- ✅ Real-time status tracking
- ✅ Comprehensive KY3P questionnaire
- ✅ Progress indicators
- ✅ 24/7 support information

### For Goldman Sachs
- ✅ Centralized vendor management
- ✅ Advanced filtering and search
- ✅ Complete vendor profiles
- ✅ Document review capability
- ✅ Questionnaire response review
- ✅ Risk assessment visibility
- ✅ Approval/rejection workflow

## Next Steps

To start the development server:
```bash
cd frontend
npm run dev
```

## Demo Credentials

**Goldman Sachs Login:**
- Email: any email ending with @gs.com (e.g., admin@gs.com)
- Password: any password (demo mode)

**Vendor Registration:**
- No login required - direct registration flow

