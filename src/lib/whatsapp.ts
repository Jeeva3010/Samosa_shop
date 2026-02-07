export function formatWhatsAppMessage({ orderDate, form, items, total, order_id }: any) {
    const lines = [
        `*New Order*`,
        `*Order ID:* ${order_id}`,
        `*Date:* ${new Date(orderDate).toLocaleString()}`,
        ``,
        `*Customer Details:*`,
        `*Name:* ${form.customer_name}`,
        form.phone ? `*Phone:* ${form.phone}` : `*Phone:* Not provided`,
        form.email ? `*Email:* ${form.email}` : `*Email:* Not provided`,
        ``,
        `*Pickup Details:*`,
        form.pickup_date ? `*Pickup Date:* ${new Date(form.pickup_date).toLocaleDateString()}` : null,
        form.pickup_time ? `*Pickup Time:* ${form.pickup_time}` : null,
        ``,
        `*Items:*`,
        ...items.map((it: any) => `- ${it.name} x ${it.quantity} = ₹${it.price * it.quantity}`),
        ``,
        `*Total:* ₹${total}`,
        `*Payment Method:* ${form.payment_method || "Not specified"}`,
        form.special_requests ? `*Special Requests:* ${form.special_requests}` : null,
        ``,
        `Please confirm availability and payment status. Thanks!`,
    ].filter(Boolean);

    return lines.join('\n');
}

export function buildWhatsAppUrl(message: string) {
    const num = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!num) throw new Error("VITE_WHATSAPP_NUMBER is not configured");

    // Remove all non-digit characters
    const sanitized = num.replace(/\D/g, '');
    console.log("Raw phone:", num, "Sanitized:", sanitized);

    // Encode the message
    const encoded = encodeURIComponent(message);

    const url = `https://wa.me/${sanitized}?text=${encoded}`;
    console.log("Final WhatsApp URL:", url.substring(0, 150) + "...");

    return url;
}
