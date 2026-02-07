# Payment Gateway - Quick Reference Card

## 🎯 What Was Done

**Payment Gateway System Implemented** with Cash and Google Pay options

---

## 📋 Changes Summary

| File | Changes |
|------|---------|
| **ContactSection.tsx** | Added pickup date/time, payment selection, screenshot upload |
| **whatsapp.ts** | Updated message formatting with Order ID and payment details |
| **sheet_order_webhook.gs** | Updated to 14-column Google Sheet schema |
| **.env** | Updated webhook URL and added secret variable |
| **docs/** | 3 new documentation files created |

---

## 🔧 Setup Timeline: 30-45 Minutes

```
[ ] 1. Update Google Apps Script (10-15 min)
    └─ Copy new code, add Script Properties, deploy

[ ] 2. Prepare Google Sheet (5 min)
    └─ Create sheet with 14 column headers or let script auto-create

[ ] 3. Update .env (2 min)
    └─ Add new webhook URL and secret

[ ] 4. Test Implementation (10 min)
    └─ Run npm run dev, submit test orders

[ ] 5. Deploy to Production (5 min)
    └─ Update production env variables
```

---

## 📦 Key Files Location

```
Quick Links:
├─ Form Code        → src/components/ContactSection.tsx (Line 1-752)
├─ Apps Script      → scripts/google-apps-script/sheet_order_webhook.gs
├─ WhatsApp Format  → src/lib/whatsapp.ts
├─ Setup Guide      → docs/payment-gateway-setup.md
├─ Action Steps     → docs/NEXT_STEPS.md
└─ Full Summary     → docs/IMPLEMENTATION_SUMMARY.md
```

---

## 🎨 Form Fields Added

```
Customer Information:
├─ Name (required)
├─ Email (required)
└─ Phone (required) ← Now mandatory!

Order Details:
├─ Items (select)
├─ Special Requests (optional)

Pickup Information:
├─ Date (required) ← NEW
└─ Time (required) ← NEW
    └─ 17 time slots: 4:00 PM to 8:00 PM

Payment:
├─ Radio 1: 💵 Cash on Pickup
└─ Radio 2: 📱 Google Pay
    └─ If Google Pay selected:
        └─ Screenshot Upload (required) ← NEW
```

---

## 💰 Payment Flow

### Cash on Pickup
```
User selects "Cash on Pickup"
         ↓
Submits form without screenshot
         ↓
Payment Status: "CASH_PENDING"
         ↓
Data goes to Google Sheet
         ↓
WhatsApp confirmation
```

### Google Pay
```
User selects "Google Pay"
         ↓
Screenshot upload field appears
         ↓
Must upload payment screenshot
         ↓
Submits form with screenshot
         ↓
Payment Status: "PAID_MANUAL"
         ↓
Data goes to Google Sheet
         ↓
WhatsApp confirmation
```

---

## 📊 Google Sheet Columns (14)

```
1. Timestamp               (Date/Time)
2. Order ID               (ORD-{timestamp})
3. Customer Name          (Text)
4. Email                  (Text)
5. Phone                  (Tel)
6. Items                  (Item x Qty; Item x Qty)
7. Total                  (₹ Amount)
8. Payment Method         (Cash / Google Pay)
9. Payment Status         (CASH_PENDING / PAID_MANUAL)
10. Pickup Date           (Date)
11. Pickup Time           (Time)
12. Special Requests      (Text)
13. Order Source          (Website)
14. WhatsApp Confirmed    (Yes/No)
```

---

## 🔑 Environment Variables

Need these in `.env`:

```env
# NEW/UPDATED
VITE_GOOGLE_SHEETS_WEBHOOK="https://script.google.com/macros/s/AKfycby97FcCj98fparq4Dn7YU9PNg-ZfA1W6Zv8n-ciwHOwzVihEBlCRmzCIf5ogzVILvqixw/exec"
VITE_GOOGLE_SHEETS_SECRET="your_strong_secret_here"

# EXISTING (unchanged)
VITE_SUPABASE_PROJECT_ID="xwwlflqxubponyesksag"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="..."
VITE_WHATSAPP_NUMBER="+91 7550314901"
```

---

## ✅ Validation Rules

**Form will reject if:**
- ❌ Customer name is empty
- ❌ Email is invalid format
- ❌ Phone is empty (changed from optional)
- ❌ No items selected
- ❌ Pickup date is today or past
- ❌ Pickup time is empty
- ❌ Google Pay selected but NO screenshot
- ❌ Screenshot file > 5MB
- ❌ File is not an image

**Form will accept if:**
- ✅ All required fields filled
- ✅ Valid email format
- ✅ Future pickup date
- ✅ Payment method selected
- ✅ Screenshot uploaded (if Google Pay)
- ✅ File < 5MB

---

## 🧪 Quick Test Checklist

```
[ ] Form renders with new fields
[ ] Pickup date picker works (no past dates)
[ ] Pickup time dropdown has 17 slots
[ ] Payment buttons toggle correctly
[ ] Screenshot field appears for Google Pay only
[ ] Can upload image files
[ ] Submit disabled until form valid
[ ] Order saves to Google Sheet
[ ] WhatsApp message opens with correct data
[ ] Order ID shows in both message and sheet
[ ] Cash orders show CASH_PENDING
[ ] Google Pay orders show PAID_MANUAL
```

---

## 🚨 Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| Orders not in sheet | Check webhook URL in .env matches Apps Script deployment |
| Screenshot won't upload | Ensure file < 5MB, is actual image (PNG/JPG/GIF) |
| Button stays disabled | Check all REQUIRED fields: name, email, phone, date, time |
| Google Pay screenshot hidden | Select Google Pay radio button to show field |
| WhatsApp doesn't open | Allow popups, message is still formatted correctly |
| Order ID format wrong | Should be `ORD-{timestamp}`, e.g., `ORD-1739192443000` |

---

## 📱 Order ID Format

```
Format: ORD-{JavaScript Timestamp}

Examples:
- ORD-1739192443000 (from Date.now())
- ORD-1739198765432
- ORD-1739205000000

Auto-generated on submission
```

---

## 🎯 Success Indicators

✅ You're done when:
1. Form has all new fields visible
2. Pickup date & time required and working
3. Payment method selection working
4. Screenshot upload for Google Pay works
5. Orders appearing in Google Sheet
6. All 14 columns populated
7. Payment status showing correctly
8. WhatsApp message with Order ID
9. Can test both cash and Google Pay flows
10. Form resets after successful submission

---

## 📞 Support Resources

**Documentation:**
- Full Setup: `docs/payment-gateway-setup.md`
- Action Steps: `docs/NEXT_STEPS.md`
- Summary: `docs/IMPLEMENTATION_SUMMARY.md`

**Code References:**
- Form Logic: `src/components/ContactSection.tsx`
- Message Format: `src/lib/whatsapp.ts`
- Apps Script: `scripts/google-apps-script/sheet_order_webhook.gs`

**Contact:**
📞 +91 7550314901

---

## 🚀 Next Action

1. **Start here:** `docs/NEXT_STEPS.md` - Follow 5-step setup
2. **Deploy:** Update Google Apps Script with new code
3. **Configure:** Set environment variables
4. **Test:** Follow testing checklist
5. **Go Live:** Deploy to production

---

**Status:** ✅ Ready for Setup
**Estimated Time:** 30-45 minutes
**Difficulty:** Medium (mostly configuration)

