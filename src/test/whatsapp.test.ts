import { describe, it, expect } from "vitest";
import { formatWhatsAppMessage } from "@/lib/whatsapp";

describe("whatsapp message formatting", () => {
    it("includes customer details, items and total", () => {
        const msg = formatWhatsAppMessage({
            orderDate: "2026-02-03T10:00:00.000Z",
            form: { customer_name: "Jeeva", phone: "+91 7550314901", email: "jeeva@example.com", special_requests: "No onions" },
            items: [
                { id: "1", name: "Samosa", quantity: 2, price: 7 },
                { id: "2", name: "Chai", quantity: 1, price: 7 },
            ],
            total: 21,
        });

        expect(msg).toContain("Jeeva");
        expect(msg).toContain("+91 7550314901");
        expect(msg).toContain("Samosa x 2");
        expect(msg).toContain("Chai x 1");
        expect(msg).toContain("Total");
        expect(msg).toContain("₹21");
    });
});
