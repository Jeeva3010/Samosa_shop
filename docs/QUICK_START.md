# 🚀 Quick Start Guide - Payment Gateway

## ⏱️ 5-Minute Overview

**What you're getting:**
- Order form with pickup date/time 📅
- Two payment options: Cash & Google Pay 💰
- Automatic order data to Google Sheet 📊
- WhatsApp integration ✉️

**Setup time:** 30-45 minutes
**Difficulty:** Medium

---

## 📥 Before You Start

Have these ready:
1. **Google Sheet ID** (from your sheet URL)
2. **Google Apps Script project open**
3. A **strong random string** for webhook secret (example: `abc123xyz789def456ghi`)
4. **Terminal/Command line** access

---

## 🎯 Your 5-Step Setup

### 1️⃣ UPDATE GOOGLE APPS SCRIPT
**Time: 10 min**

```
Go to: https://script.google.com

1. Open your Apps Script project
2. Clear the code completely
3. Paste this file contents:
   → scripts/google-apps-script/sheet_order_webhook.gs
4. Save (Ctrl+S)
```

**Set Script Properties:**
```
Project Settings (gear icon)
  ↓
Script Properties → Add property:

SHEET_ID = d/YOUR-SHEET-ID-HERE/edit  ← Copy from sheet URL
WEBHOOK_SECRET = YourRandomSecretHere123
SHEET_NAME = Orders
```

**Deploy:**
```
Deploy → New Deployment
  Type: Web app
  Execute as: [Your Email]
  Who has access: Anyone
  
→ Copy the deployment URL
```

---

### 2️⃣ CREATE GOOGLE SHEET
**Time: 5 min**

Either A or B:

**Option A: Start fresh**
```
Google Drive → New → Google Sheet
Name it: "Samosa Shop Orders"
Get URL, extract ID from:
https://docs.google.com/spreadsheets/d/{ID}/edit
```

**Option B: Use existing sheet**
```
Make sure sheet exists
Get the ID from URL
```

The script auto-creates 14-column headers on first order!

---

### 3️⃣ UPDATE .env FILE
**Time: 2 min**

Open `.env` in project root:

```env
# REPLACE THIS LINE:
VITE_GOOGLE_SHEETS_WEBHOOK="https://script.google.com/macros/s/YOUR-DEPLOYMENT-URL/exec"

# ADD THIS NEW LINE:
VITE_GOOGLE_SHEETS_SECRET="YourRandomSecretHere123"

# ALL THESE STAY THE SAME:
VITE_SUPABASE_PROJECT_ID="xwwlflqxubponyesksag"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://xwwlflqxubponyesksag.supabase.co"
VITE_WHATSAPP_NUMBER="+91 7550314901"
```

**Save the file.**

---

### 4️⃣ TEST LOCAL
**Time: 10 min**

```bash
# Terminal, in project directory:
npm run dev

# Open browser: http://localhost:5173

# Go to "Get in Touch" section
# Fill entire form:
  - Name
  - Email
  - Phone (NOW REQUIRED!)
  - Select items
  - Select PICKUP DATE (not today)
  - Select PICKUP TIME
  - Choose payment method
  - If Google Pay: upload image file

# Click Submit

# Check Results:
  ✓ Toast shows Order ID (ORD-...)
  ✓ WhatsApp opens with message
  ✓ Go to Google Sheet → New row appeared
  ✓ Check all 14 columns have data
```

---

### 5️⃣ DEPLOY TO PRODUCTION
**Time: 5 min**

**In production hosting (Vercel/Netlify/etc):**

Update environment variables:
```
VITE_GOOGLE_SHEETS_WEBHOOK = [your-new-deployment-url]
VITE_GOOGLE_SHEETS_SECRET = [matching-webhook-secret]
```

Set other vars same as local `.env`

**Test in production:**
- Submit order with Cash
- Verify in Google Sheet
- Repeat with Google Pay + screenshot

✅ Done!

---

## ✅ Quick Test Checklist

**Form Appears:**
- [ ] Name field visible
- [ ] Email field visible
- [ ] Phone field visible (required now!)
- [ ] Items selector visible
- [ ] Pickup date picker visible
- [ ] Pickup time dropdown visible
- [ ] Payment method radio buttons visible

**Form Works:**
- [ ] Can't submit without name
- [ ] Can't submit without email
- [ ] Can't submit without phone ← NEW!
- [ ] Can't submit with past pickup date
- [ ] Payment method selection toggles
- [ ] Screenshot field shows only for Google Pay
- [ ] Can upload image file

**Submission:**
- [ ] Cash order: shows Order ID, opens WhatsApp
- [ ] Data in Google Sheet
- [ ] Payment Status: CASH_PENDING
- [ ] Google Pay: must upload screenshot
- [ ] Google Pay: shows PAID_MANUAL in sheet

---

## 🆘 If Something's Wrong

| Problem | Fix |
|---------|-----|
| "Failed to post to Google Sheets" | Check webhook URL in .env is correct |
| Secret error | Check VITE_GOOGLE_SHEETS_SECRET matches Apps Script property |
| Data not in sheet | Wait 5 seconds, refresh browser, check webhook URL |
| Screenshot field won't appear | Make sure Google Pay radio is selected |
| Can't submit | Check all required fields have values |
| WhatsApp won't open | Allow popups, or manually copy message |

---

## 📞 File References

**If you need to check something:**

| What | Where |
|------|-------|
| Order form code | `src/components/ContactSection.tsx` |
| WhatsApp formatting | `src/lib/whatsapp.ts` |
| Google Apps Script | `scripts/google-apps-script/sheet_order_webhook.gs` |
| Setup details | `docs/payment-gateway-setup.md` |
| Full test checklist | `docs/NEXT_STEPS.md` |

---

## 💾 Important Values to Save

📝 Keep these handy:

```
Sheet ID: ________________________
Webhook Secret: ________________________
Deployment URL: ________________________
WhatsApp Number: +91 7550314901
```

---

## 🎯 Success = This happens:

1. **User submits order** with all info
2. **Google Sheet** receives new row instantly
3. **WhatsApp** opens automatically with details
4. **Order ID** like `ORD-1739192443000` shows up
5. **Payment status** set: `CASH_PENDING` or `PAID_MANUAL`

If all 5 happen → **You're done!** 🎉

---

## 📚 Need More Info?

See these files in `docs/`:

- **QUICK_REFERENCE.md** - Lookup info quickly
- **NEXT_STEPS.md** - Detailed setup + tests (30+ test cases!)
- **payment-gateway-setup.md** - In-depth guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details

---

## ⏰ Timeline

| Step | Time | Status |
|------|------|--------|
| 1. Apps Script | 10 min | ⬜ TODO |
| 2. Google Sheet | 5 min | ⬜ TODO |
| 3. .env update | 2 min | ⬜ TODO |
| 4. Test local | 10 min | ⬜ TODO |
| 5. Production | 5 min | ⬜ TODO |
| **TOTAL** | **32 min** | ⬜ TODO |

---

## 🚀 You're Ready!

1. ✅ Code is implemented
2. ✅ Documentation is written
3. ✅ You have this quick start
4. ✅ Everything is ready

**→ START WITH STEP 1 ABOVE**

---

**Questions?** See `docs/payment-gateway-setup.md` troubleshooting section

**Ready to deploy?** Follow the 5 steps above!

