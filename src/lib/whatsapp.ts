export function formatWhatsAppMessage({ orderDate, form, items, total }: any) {
    const lines = [
        `*New Order*`,
        `*Date:* ${new Date(orderDate).toLocaleString()}`,
        `*Customer:* ${form.customer_name}`,
        form.phone ? `*Phone:* ${form.phone}` : `*Phone:* Not provided`,
        form.email ? `*Email:* ${form.email}` : `*Email:* Not provided`,
        ``,
        `*Items:*`,
        ...items.map((it: any) => `- ${it.name} x ${it.quantity} = ₹${it.price * it.quantity}`),
        ``,
        `*Total:* ₹${total}`,
        form.special_requests ? `*Special Requests:* ${form.special_requests}` : null,
        ``,
        `Please confirm availability and next steps. Thanks!`,
    ].filter(Boolean);

    return lines.join('\n');
}

export function buildWhatsAppUrl(message: string) {
    const num = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!num) throw new Error("VITE_WHATSAPP_NUMBER is not configured");
    const sanitized = num.replace(/\D/g, '');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${sanitized}?text=${encoded}`;
}
