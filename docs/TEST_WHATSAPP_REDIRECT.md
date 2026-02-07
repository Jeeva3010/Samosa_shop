# 🧪 How to Test WhatsApp Redirect - Step by Step

## ⚙️ Prerequisites
- Dev server running: `http://localhost:8082/`
- Browser with popup capability
- Browser DevTools (F12)

---

## 📱 Quick Test (2 minutes)

### Step 1: Open the Site
```
Open browser → http://localhost:8082/
```

### Step 2: Allow Popups (if not already allowed)
```
Browser Settings → Privacy & Security → Pop-ups and redirects
Allow popups from localhost:8082
```

### Step 3: Scroll to Order Form
```
Scroll down → "Get in Touch" section
Look for "Place Your Order" form
```

### Step 4: Fill the Form
```
✓ Name: Any name (e.g., "John Test")
✓ Email: Any email (e.g., "test@example.com")
✓ Phone: +91 9550012345 (required!)
✓ Items: Click "+" to add 1-2 items
✓ Pickup Date: Tomorrow's date (click calendar)
✓ Pickup Time: Select any time (e.g., "4:00 PM")
✓ Payment: Select "💵 Cash on Pickup"
✓ Special Requests: (optional, skip)
```

### Step 5: Submit Order
```
Click "Submit Order" button
Watch for confirmation toast message
```

### Step 6: Check Results

**Expected Toast Messages:**
```
✅ Title: "Order Submitted!"
✅ Message: "Order ID: ORD-1770452806395 — Opening WhatsApp."
```

**Check Browser:**
```
✓ New tab opens OR
✓ WhatsApp appears in current window OR  
✓ You see popup blocked message (if popups blocked)
```

**Check Google Sheet:**
```
✓ Refresh your Google Sheet
✓ New row with Order ID, customer details, payment status
```

---

## 🔍 Advanced Debugging (5 minutes)

### Open Browser Console
```
Keyboard: F12 (Windows) or Command+Option+J (Mac)
Or: Right-click → Inspect → Console tab
```

### Look for These Logs

**When you submit the form:**
```
Raw phone: +91 7550314901 Sanitized: 917550314901
Final WhatsApp URL: https://wa.me/917550314901?text=*New%20Order*...
WhatsApp URL: https://wa.me/917550314901?text=...
Message length: 450
```

**If error occurs:**
```
WhatsApp URL error: [specific error message]
Message formatting error: [specific error]
```

### Verify Each Step

1. **Phone Number Parsing**
   ```
   Expected: "Raw phone: +91 7550314901 Sanitized: 917550314901"
   If different: Check .env file VITE_WHATSAPP_NUMBER
   ```

2. **URL Formation**
   ```
   Expected: "https://wa.me/917550314901?text=..."
   Starts with "https://wa.me/"
   Contains your phone number (91 prefix)
   ```

3. **Message Length**
   ```
   Expected: Between 350-500 characters
   Too short: Missing order details
   Too long: May exceed browser URL limits
   ```

---

## ✅ Success Scenarios

### Scenario 1: WhatsApp Opens Successfully
```
1. Submit form
2. Toast: "Order Submitted!"
3. New browser tab opens
4. WhatsApp Web or app loads
5. Pre-filled message visible
6. All order details shown
```

### Scenario 2: Popup Blocked by Browser
```
1. Submit form
2. Toast: "Order Submitted!"
3. Popup notification appears from browser
4. Allow popups
5. WhatsApp opens
```

### Scenario 3: Manual Contact
```
1. Submit form
2. Toast shows Order ID: ORD-1770452...
3. You can manually go to WhatsApp
4. Copy order ID
5. Send to shop number manually
```

---

## ❌ Troubleshooting

### Issue: Nothing Happens When Clicking Submit

**Check:**
- [ ] All required fields filled? (name, email, phone, pickup date, time)
- [ ] At least one item selected?
- [ ] Console shows errors? (see Advanced Debugging)

**Fix:**
```javascript
// Check in console:
document.body.innerHTML // Should show form with filled values
```

### Issue: Toast Shows Order ID But No WhatsApp

**Check:**
- [ ] Browser has popup blocker enabled?
- [ ] Console shows "WhatsApp URL error"?
- [ ] Phone number in .env correct?

**Fix:**
1. Check console for specific error
2. Verify .env: `VITE_WHATSAPP_NUMBER="+91 7550314901"`
3. Try different browser
4. Disable popup blocker

### Issue: WhatsApp Opens But Message Incomplete

**Check:**
- [ ] Message starts with "*New Order*"?
- [ ] Includes Order ID?
- [ ] Shows customer details?
- [ ] Shows items and total?

**Fix:**
```javascript
// In console, check:
navigator.userAgent // Browser info
window.navigator.onLine // Internet connection
```

### Issue: Phone Number Shows Wrong

**Check:**
- [ ] Verify in console logs: "Sanitized: 917550314901"
- [ ] If different, .env is wrong

**Fix:**
```
Edit .env:
VITE_WHATSAPP_NUMBER="+91 7550314901"
Restart dev server: npm run dev
```

---

## 🎯 Test Scenarios Matrix

| Scenario | Phone | Items | Payment | Expected |
|----------|-------|-------|---------|----------|
| Basic Cash | ✓ | ✓ | Cash | WhatsApp opens |
| GPS with Screenshot | ✓ | ✓ | GPay | WhatsApp opens (with screenshot attached in message) |
| Special Requests | ✓ | ✓ | Cash | Message includes special requests |
| No Phone | ✗ | ✓ | Cash | Error: "Phone required" |
| No Items | ✓ | ✗ | Cash | Error: "Select items" |
| Past Date | ✓ | ✓ | Cash | Date picker blocks past dates |

---

## 📊 Data Flow Verification

### Step 1: Submit Order
```
Form → Validation → Google Sheets API → Response
Expected Response: { ok: true, order_id: "ORD-1770452..." }
```

### Step 2: Format Message
```
Order Data → WhatsApp Message Formatter → Encoded Text
Expected: Readable message with all order details
```

### Step 3: Open WhatsApp
```
Message → URL Encoder → wa.me URL → User Agent
Expected: WhatsApp app/web loads with message
```

---

## 🚀 Performance Check

### Expected Times
```
Form fill: < 30 seconds
Submission: < 2 seconds
Toast appears: Instant (< 500ms)
WhatsApp opens: < 3 seconds (after submission)
Google Sheet updates: < 5 seconds
```

### If Taking Longer
```
Check network Tab in DevTools (F12 → Network)
Look for slow requests
Verify Google Apps Script webhook is responding
```

---

## 📸 Screenshots to Verify

1. **After Submission, You Should See:**
   - Toast with Order ID
   - New browser tab/window opening
   - WhatsApp Web loading (or app launching)

2. **In WhatsApp Message:**
   - Order ID at top
   - Customer name/email/phone
   - Items list with quantities
   - Total amount
   - Pickup date & time
   - Payment method
   - Special requests (if any)

3. **In Google Sheet:**
   - New row added
   - All 14 columns populated
   - Order ID matches
   - Payment status: CASH_PENDING or PAID_MANUAL

---

## 🔧 Diagnostic Commands

Run these in browser console (F12 → Console) to diagnose:

```javascript
// Check if window.open works
window.open("about:blank", "_blank")

// Check WhatsApp number from env
console.log(import.meta.env.VITE_WHATSAPP_NUMBER)

// Check if fetch is available
console.log(typeof fetch)

// Check network connectivity
navigator.onLine ? "Online" : "Offline"

// Check all environment variables
console.log(import.meta.env)
```

---

## ✨ Expected Console Output

**Good Result:**
```
✓ Raw phone: +91 7550314901 Sanitized: 917550314901
✓ Final WhatsApp URL: https://wa.me/917550314901?text=...
✓ WhatsApp URL: https://wa.me/917550314901?text=...
✓ Message length: 450
✓ No errors shown
✓ WhatsApp tab opens automatically
```

**If Blocked:**
```
✓ Logs show as above
✗ No new tab opens
✓ Toast shows: "Popup Blocked"
✓ You can manually open WhatsApp
```

---

## 🎉 When You're Done Testing

1. **Verify:**
   - [ ] Orders submit successfully
   - [ ] WhatsApp opens (or message formatted correctly)
   - [ ] Google Sheet receives data
   - [ ] Order ID appears in all 3 places

2. **Document Issues:**
   - [ ] Screenshot console errors
   - [ ] Note timing if slow
   - [ ] Report any edge cases

3. **Ready for Production:**
   - [ ] Update `.env` with production webhook
   - [ ] Deploy to hosting
   - [ ] Test with real Google Sheet
   - [ ] Verify live operations

---

## 📞 Need Help?

1. **Check:** [WHATSAPP_FIX.md](./WHATSAPP_FIX.md) - Detailed explanation
2. **Debug:** Console logs with phone number & URL
3. **Verify:** Correct .env configuration
4. **Test:** Using this step-by-step guide

---

**Dev Server:** http://localhost:8082/
**Status:** ✅ Ready to test
**Time to complete:** 2-5 minutes
