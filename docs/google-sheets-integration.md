# Google Sheets Integration (Google Apps Script)

This document explains how to set up a secure Google Apps Script endpoint that accepts order data and appends a row to a Google Sheet. The frontend will POST to this endpoint to persist orders.

## Steps

1. Create the Google Sheet (columns will be created automatically when script runs).
2. Create a new Google Apps Script project and paste the contents of `scripts/google-apps-script/sheet_order_webhook.gs`.
3. In the Apps Script editor set script properties:
   - `SHEET_ID`: the ID of your Google Sheet (from the sheet URL)
   - `WEBHOOK_SECRET`: a random secret token (store the same value locally as `VITE_GOOGLE_SHEETS_SECRET`)
   - (optional) `SHEET_NAME`: name of the tab to write (defaults to `Orders`)
4. Deploy the script as a Web App ("Execute as: Me"), and set access to whoever you prefer (for public consumption use "Anyone").
5. Copy the deployment URL and set it as `VITE_GOOGLE_SHEETS_WEBHOOK` in your frontend env (see below).
Note: For convenience I added the endpoint you provided to the local `.env` file so the project is already pointed at your deployed script for local testing. If you prefer this not be committed, remove or move it to a machine-specific `.env.local` file.
## Environment variables (local `.env`)

- `VITE_GOOGLE_SHEETS_WEBHOOK` - the deployed web app URL
- `VITE_GOOGLE_SHEETS_SECRET` - secret token (same as set in script properties)
- `VITE_WHATSAPP_NUMBER` - business phone number in international format (e.g. +919876543210)

Example `.env.local`:

VITE_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/s/XXXXX/exec
VITE_GOOGLE_SHEETS_SECRET=supersecret-token
VITE_WHATSAPP_NUMBER=+919976715925

## Security Notes

- The Apps Script reads the `WEBHOOK_SECRET` property and requires the same secret to be submitted in the request body (`secret` or `_secret`).
- Keep the secret out of version control; use environment variables or secret storage in deployment.

## CORS notes & browser usage

Browsers enforce CORS preflight for requests with custom headers or certain content types. To avoid preflight issues with Google Apps Script (which can be tricky to handle for OPTIONS requests), the frontend helper sends a "simple" POST (Content-Type: `text/plain`) and avoids custom request headers. The `VITE_GOOGLE_SHEETS_SECRET` is included in the request body as `_secret` to avoid adding custom headers which trigger preflight.

If you still see CORS errors in the browser console:
- Make sure your Apps Script is deployed as a Web App and set to allow access (for public use, "Anyone, even anonymous").
- Ensure your Apps Script responses include `Access-Control-Allow-Origin: *` (see `scripts/google-apps-script/sheet_order_webhook.gs` which sets this header in responses).
- As an alternative, proxy the request through your own server (or serverless function) which can control CORS more easily.

## What the frontend sends

The frontend will POST the JSON body (as plain text) containing:

{
  order_date, customer_name, email, phone, special_requests, items: [{id, name, quantity, price}], total, _secret
}

The Apps Script will append a row with: Order Date & Time, Customer Name, Email, Phone, Ordered Items, Total Amount, Special Requests.

This approach keeps credentials off the frontend (except the webhook URL and a short-lived secret) and does not require service account keys to be exposed in the browser.
