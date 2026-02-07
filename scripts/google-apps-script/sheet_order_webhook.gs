/**
 * Google Apps Script Webhook to append incoming orders to a Google Sheet.
 *
 * Setup:
 * - Create a new Apps Script project.
 * - Set script properties:
 *    - 'SHEET_ID' => ID of target Google Sheet
 *    - 'WEBHOOK_SECRET' => a secret token you will set on the frontend env var
 *    - (optional) 'SHEET_NAME' => name of sheet to use (defaults to 'Orders')
 * - Deploy as "Web app" and set "Execute as: Me" and "Who has access: Anyone" (or Domain as appropriate)
 * - Use the deployment URL as VITE_GOOGLE_SHEETS_WEBHOOK
 */

const PROPS = PropertiesService.getScriptProperties();
const SHEET_ID = PROPS.getProperty('SHEET_ID');
const WEBHOOK_SECRET = PROPS.getProperty('WEBHOOK_SECRET');
const SHEET_NAME = PROPS.getProperty('SHEET_NAME') || 'Orders';

function ensureHeader(sheet) {
  const headers = [
    'Timestamp',
    'Order ID',
    'Customer Name',
    'Email',
    'Phone',
    'Items',
    'Total',
    'Payment Method',
    'Payment Status',
    'Pickup Date',
    'Pickup Time',
    'Special Requests',
    'Order Source',
    'WhatsApp Confirmed'
  ];
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join('') !== headers.join('')) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');

    if (!SHEET_ID || !WEBHOOK_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Server not configured (missing SHEET_ID or WEBHOOK_SECRET)' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }

    // secret can be provided in body as `secret` or `_secret`
    const provided = payload._secret || payload.secret || (e.parameter && e.parameter.secret);
    if (provided !== WEBHOOK_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*')
        .setResponseCode(401);
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    ensureHeader(sheet);

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const orderId = payload.order_id || 'ORD-' + Date.now();
    const customer = payload.customer_name || '';
    const email = payload.email || '';
    const phone = payload.phone || '';
    const items = Array.isArray(payload.items) ? payload.items.map(i => `${i.name} x ${i.quantity}`).join('; ') : '';
    const total = payload.total || '';
    const paymentMethod = payload.payment_method || 'Not specified';
    const paymentStatus = payload.payment_status || 'PENDING';
    const pickupDate = payload.pickup_date || '';
    const pickupTime = payload.pickup_time || '';
    const specialRequests = payload.special_requests || '';
    const orderSource = payload.order_source || 'Website';
    const whatsappConfirmed = payload.whatsapp_confirmed ? 'Yes' : 'No';

    sheet.appendRow([
      timestamp,
      orderId,
      customer,
      email,
      phone,
      items,
      total,
      paymentMethod,
      paymentStatus,
      pickupDate,
      pickupTime,
      specialRequests,
      orderSource,
      whatsappConfirmed
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, order_id: orderId }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setResponseCode(500);
  }
}
