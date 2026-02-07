# Payment Gateway Setup Guide

## Overview

The Samosa Shop now supports two payment methods:
1. **Cash on Pickup** - Payment when customer picks up order
2. **Google Pay** - Manual payment with screenshot verification

## Features Implemented

### ✅ Order Form Enhancements
- **Customer Name** (required) - Customer's full name
- **Email** (required) - Customer's email address
- **Phone Number** (required) - Customer's contact number
- **Order Items** - Already present, select items and quantities
- **Pickup Date** (required) - Date picker for order pickup
- **Pickup Time** (required) - Dropdown with 15-minute intervals (4:00 PM - 8:00 PM)
- **Special Instructions** (optional) - Additional requests or allergies

### ✅ Payment Selection
- Radio button options for two payment methods
- Clear descriptions for each method
- Visual indicators showing selected method

### ✅ Order Submission Logic

#### Cash on Pickup Flow:
1. Customer fills form with all details
2. Selects "Cash on Pickup"
3. Submits order
4. `payment_status` → `"CASH_PENDING"`
5. Order details sent to WhatsApp for confirmation

#### Google Pay Flow:
1. Customer fills form with all details
2. Selects "Google Pay"
3. **Must upload screenshot** of Google Pay payment
4. Submits order
5. `payment_status` → `"PAID_MANUAL"`
6. Order details + screenshot sent to WhatsApp
7. Admin verifies payment from screenshot

### ✅ Validation Rules
- ✓ Pickup date required (cannot be in the past)
- ✓ Pickup time required (15-min slots from 4:00 PM to 8:00 PM)
- ✓ Phone number required (now mandatory)
- ✓ Screenshot **required ONLY for Google Pay**
- ✓ Submit button disabled while uploading/submitting
- ✓ Toast notifications for all success/error states

## Google Sheet Columns

Your new Google Sheet should have these columns:

| # | Column Name | Type | Description |
|---|---|---|---|
| 1 | Timestamp | Text | Order submission time (IST) |
| 2 | Order ID | Text | Unique order identifier (ORD-{timestamp}) |
| 3 | Customer Name | Text | Customer's name |
| 4 | Email | Text | Customer's email |
| 5 | Phone | Text | Customer's phone number |
| 6 | Items | Text | List of ordered items with quantities |
| 7 | Total | Number | Total order amount (₹) |
| 8 | Payment Method | Text | "Cash" or "Google Pay" |
| 9 | Payment Status | Text | "CASH_PENDING" or "PAID_MANUAL" |
| 10 | Pickup Date | Text | Date of pickup |
| 11 | Pickup Time | Text | Preferred pickup time |
| 12 | Special Requests | Text | Special instructions from customer |
| 13 | Order Source | Text | "Website" or other source |
| 14 | WhatsApp Confirmed | Text | "Yes" or "No" |

## Setup Instructions

### Step 1: Update Google Apps Script

Your new Google Apps Script should use this webhook URL:
```
https://script.google.com/macros/s/AKfycby97FcCj98fparq4Dn7YU9PNg-ZfA1W6Zv8n-ciwHOwzVihEBlCRmzCIf5ogzVILvqixw/exec
```

The updated script in `scripts/google-apps-script/sheet_order_webhook.gs` handles all new columns automatically.

### Step 2: Configure Google Apps Script Properties

In your Google Apps Script Project Settings, set these script properties:

```
SHEET_ID: Your Google Sheet ID
WEBHOOK_SECRET: A secure random string (same as VITE_GOOGLE_SHEETS_SECRET)
SHEET_NAME: "Orders" (or your preferred sheet name)
```

### Step 3: Update Environment Variables

Update `.env` file with:

```env
# Google Sheets Integration
VITE_GOOGLE_SHEETS_WEBHOOK="https://script.google.com/macros/s/AKfycby97FcCj98fparq4Dn7YU9PNg-ZfA1W6Zv8n-ciwHOwzVihEBlCRmzCIf5ogzVILvqixw/exec"
VITE_GOOGLE_SHEETS_SECRET="your_secure_webhook_secret_here"

# WhatsApp Integration
VITE_WHATSAPP_NUMBER="+91 7550314901"
```

### Step 4: Create/Update Google Sheet

1. Create or update your Google Sheet with the columns listed above
2. Make note of the Sheet ID (from the URL)
3. Share the sheet with the email that the Google Apps Script will run as

### Step 5: Deploy Google Apps Script

1. Go to Google Apps Script: https://script.google.com
2. Create a new project or open existing one
3. Copy the code from `scripts/google-apps-script/sheet_order_webhook.gs`
4. Set Script Properties (Project Settings)
5. Deploy as "New Deployment":
   - Type: "Web app"
   - Execute as: Your account
   - Who has access: "Anyone"
6. Copy the deployment URL
7. Update `VITE_GOOGLE_SHEETS_WEBHOOK` with this URL

## Payment Flow Diagram

```
Customer Submits Order
    ↓
Validation (all fields required + screenshot for GPay)
    ↓
Generate Order ID
    ↓
POST to Google Sheets Webhook
    ├─ All order details
    ├─ Payment method selected
    ├─ Payment status set
    └─ Pickup date/time
    ↓
Success → Reset Form
    ↓
Format WhatsApp Message
    ├─ Order ID
    ├─ Customer Details
    ├─ Items & Total
    ├─ Pickup Schedule
    ├─ Payment Status
    └─ Special Requests
    ↓
Open WhatsApp Chat URL
    ↓
Customer/Admin Communicates
```

## Data Flow

### Order Submission
```
Frontend Form → Validation (Zod Schema)
    ↓
Generate Order ID (ORD-{timestamp})
    ↓
POST Request to Google Apps Script Webhook
    ↓
Apps Script appends row to Google Sheet
    ↓
Response: Order ID + Confirmation
    ↓
Format WhatsApp Message
    ↓
Open WhatsApp Chat with pre-filled message
```

## Key Changes Made

### 1. ContactSection.tsx
- Added `pickup_date` and `pickup_time` fields
- Added payment method selection (radio buttons)
- Added screenshot upload for Google Pay
- Updated validation schema with new required fields
- Modified order mutation to handle payment status
- Added pre-submission validation for screenshot

### 2. whatsapp.ts
- Updated message formatting to include:
  - Order ID
  - Pickup Date and Time
  - Payment Method
  - Structured customer details

### 3. sheet_order_webhook.gs (Google Apps Script)
- Updated column headers (14 columns total)
- Dynamic header creation
- All new fields included in row append
- Returns order ID in response

### 4. Environment Variables
- Updated `VITE_GOOGLE_SHEETS_WEBHOOK` with new URL
- Added `VITE_GOOGLE_SHEETS_SECRET` for webhook authentication

## Testing Checklist

- [ ] Form validation works (all required fields)
- [ ] Pickup date cannot be in the past
- [ ] Pickup time dropdown shows all slots
- [ ] Payment method selection toggles screenshot field
- [ ] Screenshot upload accepts images (< 5MB)
- [ ] Submit button disabled until screenshot uploaded for GPay
- [ ] Order submission sends data to Google Sheet
- [ ] Order ID generated correctly
- [ ] WhatsApp message contains all details
- [ ] Cash orders show "CASH_PENDING"
- [ ] Google Pay orders show "PAID_MANUAL"
- [ ] Toast notifications appear for success/errors

## Troubleshooting

### Orders not appearing in Google Sheet
1. Verify `VITE_GOOGLE_SHEETS_WEBHOOK` URL is correct
2. Check Google Apps Script is deployed as "Web app"
3. Verify `VITE_GOOGLE_SHEETS_SECRET` matches script property
4. Check browser console for error messages

### Screenshot not uploading
1. Ensure file is less than 5MB
2. Supported formats: PNG, JPG, GIF
3. Check browser console for network errors

### WhatsApp not opening automatically
1. Allow popups from the website
2. Same-origin iframe restrictions might apply
3. Message will be formatted correctly; manual copy-paste works

## Future Enhancements

- [ ] Store screenshot automatically in Google Drive
- [ ] Send screenshot to admin via email
- [ ] QR code payment integration
- [ ] Real-time order tracking
- [ ] Payment status updates via email/SMS
- [ ] Mobile app integration

## Support

For issues or questions, contact:
- Phone: +91 7550314901
- Email: your-email@example.com
