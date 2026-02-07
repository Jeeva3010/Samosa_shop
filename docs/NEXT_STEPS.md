# Payment Gateway Implementation - Next Steps

## ✅ COMPLETED IMPLEMENTATION

Your payment gateway has been successfully implemented with all required features:

### 1. **Frontend Form Enhanced** (ContactSection.tsx)
- ✓ Customer Name (required)
- ✓ Email (required)  
- ✓ Phone Number (required)
- ✓ Pickup Date (required) - date picker, min today
- ✓ Pickup Time (required) - dropdown with 15-min slots (4:00 PM - 8:00 PM)
- ✓ Payment Method Selection - Radio buttons for Cash/Google Pay
- ✓ Google Pay Screenshot Upload - File upload with 5MB limit
- ✓ Special Requests (optional)

### 2. **Payment Logic Implemented**
- ✓ Cash on Pickup → `payment_status: "CASH_PENDING"`
- ✓ Google Pay → `payment_status: "PAID_MANUAL"` (requires screenshot)
- ✓ Order ID auto-generated (ORD-{timestamp})
- ✓ Form validation with Zod schemas
- ✓ Screenshot required validation for Google Pay
- ✓ Button disabled during upload/submission

### 3. **Data Structure Updated**
- ✓ Google Apps Script updated with 14 new columns
- ✓ WhatsApp message formatting includes all new fields
- ✓ Environment variables configured
- ✓ Comprehensive documentation created

---

## 🚀 YOUR TO-DO LIST

### STEP 1: Update Google Apps Script Project
**Timeline: 10-15 minutes**

1. Go to https://script.google.com
2. Create a new project or find your existing one
3. Replace the code with updated script from:
   ```
   scripts/google-apps-script/sheet_order_webhook.gs
   ```
4. Go to **Project Settings** (gear icon)
5. Add **Script Properties** with these values:
   ```
   SHEET_ID = <your-google-sheet-id>
   WEBHOOK_SECRET = choose-a-strong-random-string
   SHEET_NAME = Orders
   ```
   
   To find your Sheet ID: Open Google Sheet → URL contains: 
   ```
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
   ```

6. Click **Deploy** → **New Deployment**
   - Type: "Web app"
   - Execute as: [Your account]
   - Who has access: "Anyone"
7. Copy the deployment URL and update `.env`:
   ```env
   VITE_GOOGLE_SHEETS_WEBHOOK="<new-deployment-url>"
   VITE_GOOGLE_SHEETS_SECRET="your-webhook-secret"
   ```

### STEP 2: Prepare Your Google Sheet
**Timeline: 5 minutes**

1. Create or open your target Google Sheet
2. Make sure the first row has these exact column names:
   ```
   Timestamp | Order ID | Customer Name | Email | Phone | Items | Total | 
   Payment Method | Payment Status | Pickup Date | Pickup Time | 
   Special Requests | Order Source | WhatsApp Confirmed
   ```
3. Share the sheet with the email account that runs the Apps Script
4. The script will auto-create columns if they don't exist

**OR** - Let the script auto-create columns:
- Just make sure sheet exists with the name you set in SHEET_NAME
- The `ensureHeader()` function will create headers on first order

### STEP 3: Update Environment Variables
**Timeline: 2 minutes**

Update `.env` file:
```env
# Google Sheets Integration
VITE_GOOGLE_SHEETS_WEBHOOK="https://script.google.com/macros/s/AKfycby97FcCj98fparq4Dn7YU9PNg-ZfA1W6Zv8n-ciwHOwzVihEBlCRmzCIf5ogzVILvqixw/exec"
VITE_GOOGLE_SHEETS_SECRET="your_secure_webhook_secret_here"

# WhatsApp Integration (Already configured)
VITE_WHATSAPP_NUMBER="+91 7550314901"
```

### STEP 4: Test the Implementation
**Timeline: 10 minutes**

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test the order form:**
   - Fill in all required fields
   - Select items and quantities
   - Select Cash on Pickup → Submit (no screenshot needed)
   - Verify order appears in Google Sheet
   - Check WhatsApp message contains all fields

3. **Test Google Pay flow:**
   - Fill in all fields again
   - Select Google Pay (screenshot field appears)
   - Try to submit WITHOUT screenshot (should reject)
   - Upload a test screenshot
   - Submit order
   - Verify in Google Sheet: `payment_status = "PAID_MANUAL"`

4. **Verify in Google Sheet:**
   - New row appears with all data
   - Order ID format: `ORD-{timestamp}`
   - Payment Status: Either "CASH_PENDING" or "PAID_MANUAL"
   - All pickup info populated
   - Special requests included

### STEP 5: Deployment Setup
**Timeline: 5 minutes**

Before going live, update hosted `.env`:
- Update `VITE_GOOGLE_SHEETS_WEBHOOK` in production environment
- Ensure `VITE_GOOGLE_SHEETS_SECRET` matches Apps Script property
- Test in production environment

---

## 📊 Data Flow Reference

```
Customer submits order
       ↓
Validation (all required fields + screenshot for GPay)
       ↓
Generate Order ID (ORD-{timestamp})
       ↓
POST to Google Apps Script Webhook
       ├─ All form data
       ├─ Payment method (Cash/Google Pay)
       ├─ Payment status (CASH_PENDING/PAID_MANUAL)
       ├─ Pickup date & time
       └─ Order ID
       ↓
Google Sheet row created with 14 columns
       ↓
Success response returned
       ↓
WhatsApp message formatted with:
       ├─ Order ID
       ├─ Customer details
       ├─ Items list
       ├─ Pickup info
       ├─ Payment status
       └─ Special requests
       ↓
WhatsApp chat opens automatically
```

---

## 🔍 Testing Checklist

### Form Validation
- [ ] All required fields show error if empty
- [ ] Email validation works
- [ ] Phone must be filled (previously optional)
- [ ] Pickup date cannot be today or past dates
- [ ] Pickup time dropdown works with 15-min intervals
- [ ] At least one item must be selected

### Payment Methods
- [ ] Cash on Pickup option visible and selectable
- [ ] Google Pay option visible and selectable
- [ ] Screenshot field appears ONLY when Google Pay selected
- [ ] Screenshot field hidden when switching back to Cash

### Screenshot Upload
- [ ] Can upload image files (PNG, JPG, GIF)
- [ ] Shows file name after upload
- [ ] Shows error for files > 5MB
- [ ] Shows error for non-image files
- [ ] Can change selected file

### Form Submission
- [ ] Submit button disabled when:
  - [ ] No items selected
  - [ ] Pickup date empty
  - [ ] Pickup time empty
  - [ ] Google Pay selected but no screenshot
- [ ] Submit button enabled when all validations pass
- [ ] Shows loading state during submission
- [ ] Success toast shows Order ID
- [ ] Form resets after submission
- [ ] Screenshot clears after submission

### Google Sheet Integration
- [ ] New row appears within 5 seconds
- [ ] All 14 columns populated correctly:
  1. [ ] Timestamp (IST format)
  2. [ ] Order ID (ORD-{timestamp})
  3. [ ] Customer Name
  4. [ ] Email
  5. [ ] Phone
  6. [ ] Items (formatted as "Item x Qty; Item x Qty")
  7. [ ] Total (₹ amount)
  8. [ ] Payment Method ("Cash" or "Google Pay")
  9. [ ] Payment Status ("CASH_PENDING" or "PAID_MANUAL")
  10. [ ] Pickup Date
  11. [ ] Pickup Time
  12. [ ] Special Requests
  13. [ ] Order Source ("Website")
  14. [ ] WhatsApp Confirmed ("No" initially)

### WhatsApp Integration
- [ ] Message opens in new tab automatically
- [ ] Message includes Order ID
- [ ] Message includes customer details
- [ ] Message includes all items ordered
- [ ] Message includes pickup date & time
- [ ] Message includes payment status
- [ ] Message includes special requests
- [ ] Format is readable and organized

---

## 🐛 Troubleshooting Guide

### Orders Not Appearing in Google Sheet

**Problem:** Form submits but data doesn't appear in sheet

**Solutions:**
1. Check browser console for errors:
   ```
   Network tab → Look for POST to webhook URL
   Check response status (should be 200)
   ```
2. Verify Apps Script deployment:
   ```
   - Go to Apps Script project
   - Check latest deployment exists
   - Deploy again if needed
   ```
3. Check script properties:
   ```
   - SHEET_ID must be correct
   - WEBHOOK_SECRET must match .env variable
   ```
4. Check sheet exists and is shared:
   ```
   - Sheet must be accessible by the account running script
   - Look for any "Unauthorized" errors
   ```

### Screenshot Upload Not Working

**Problem:** File upload doesn't accept images

**Solutions:**
1. Check file size < 5MB
2. Verify file type is image (PNG, JPG, GIF)
3. Try different browser
4. Clear browser cache

### WhatsApp Not Opening

**Problem:** WhatsApp doesn't open automatically after submission

**Solutions:**
1. Allow popups from website
2. Check if it opens in background tab
3. Verify VITE_WHATSAPP_NUMBER is correct
4. Manual copy-paste still works - message is formatted

### Payment Status Not Showing Correctly

**Problem:** Cash orders showing as PAID_MANUAL or vice versa

**Solutions:**
1. Clear browser cache
2. Verify payment_method selected before submission
3. Check that form schema validation passing
4. Look at payload sent to webhook in network tab

---

## 📝 Sample Data

### Cash Order Example
```
Timestamp: 2/10/2025, 5:30 PM
Order ID: ORD-1739192443000
Customer: John Doe
Email: john@example.com
Phone: +91 9550012345
Items: Samosa x 2; Vadai x 1
Total: 21
Payment Method: Cash
Payment Status: CASH_PENDING
Pickup Date: 2/11/2025
Pickup Time: 5:30 PM
Special Requests: No onions
Order Source: Website
WhatsApp Confirmed: No
```

### Google Pay Order Example
```
Timestamp: 2/10/2025, 5:35 PM
Order ID: ORD-1739192503000
Customer: Jane Smith
Email: jane@example.com
Phone: +91 9550054321
Items: Samosa x 3
Total: 21
Payment Method: Google Pay
Payment Status: PAID_MANUAL
Pickup Date: 2/11/2025
Pickup Time: 6:00 PM
Special Requests: Extra salt
Order Source: Website
WhatsApp Confirmed: No
```

---

## 🎯 Success Criteria

You'll know everything is working when:

1. ✅ Form has all new fields and validations
2. ✅ Can select payment method
3. ✅ Screenshot upload works for Google Pay
4. ✅ Order submitted successfully
5. ✅ Data appears in Google Sheet within seconds
6. ✅ All 14 columns have correct data
7. ✅ WhatsApp message opens with order details
8. ✅ Cash orders show "CASH_PENDING"
9. ✅ Google Pay orders show "PAID_MANUAL"
10. ✅ Order ID correctly formatted

---

## 📞 Support

For issues during setup:
1. Check the troubleshooting guide above
2. Review [payment-gateway-setup.md](./payment-gateway-setup.md)
3. Check browser console for specific error messages
4. Verify all environment variables match expectations

**Contact:** +91 7550314901

---

## 🚀 Future Enhancements

After testing is complete, consider:
- [ ] WhatsApp message image attachment (send screenshot back)
- [ ] Email notifications for orders
- [ ] SMS confirmations
- [ ] Admin dashboard to view orders
- [ ] Automatic payment verification
- [ ] Order tracking page
- [ ] Refund processing
