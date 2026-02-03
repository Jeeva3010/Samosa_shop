/**
 * sendOrderToSheets - send order payload to configured Google Apps Script webhook
 * Uses Vite env vars: VITE_GOOGLE_SHEETS_WEBHOOK and optional VITE_GOOGLE_SHEETS_SECRET
 */
export async function sendOrderToSheets(payload: any) {
    const endpoint = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK;
    if (!endpoint) {
        throw new Error("Google Sheets webhook URL (VITE_GOOGLE_SHEETS_WEBHOOK) is not configured.");
    }
    const secret = import.meta.env.VITE_GOOGLE_SHEETS_SECRET;

    // Build body and ensure secret is in the body (avoid custom headers to prevent preflight CORS)
    const bodyPayload = { ...payload, _sent_at: new Date().toISOString() };
    if (secret && !bodyPayload._secret && !bodyPayload.secret) {
        bodyPayload._secret = secret;
    }

    let res: Response;
    try {
        // Use text/plain content type (a "simple" request) and avoid custom headers to prevent preflight
        res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(bodyPayload),
        });
    } catch (err: any) {
        // Often indicates a network or CORS-level failure (e.g. preflight blocked)
        throw new Error(
            "Network or CORS error when contacting Google Sheets webhook. If you see a CORS error in the browser console, ensure the endpoint allows requests from this origin or use the Apps Script with Access-Control-Allow-Origin headers, or proxy the request through your server."
        );
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.error || "Failed to post order to Google Sheets");
    }

    return data;
}
