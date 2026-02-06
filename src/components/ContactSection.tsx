import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Clock, Loader2, Plus, Minus, Trash2 } from "lucide-react";
import { z } from "zod";
import { sendOrderToSheets } from "@/lib/googleSheets";
import { formatWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

// Validation schemas
const inquirySchema = z.object({
  customer_name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message too long"),
});

const orderSchema = z.object({
  customer_name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  special_requests: z.string().trim().max(500, "Special requests too long").optional(),
});

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  menuItemId: string;
  quantity: number;
}

const ContactSection = () => {
  const { toast } = useToast();

  // Inquiry form state (email prefilled per request)
  const [inquiryForm, setInquiryForm] = useState({
    customer_name: "",
    email: "",
    message: "",
  });

  // Order form state (email prefilled and phone populated only in the order form)
  const [orderForm, setOrderForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    special_requests: "",
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const pendingWindowRef = useRef<Window | null>(null);

  // Fetch menu items for order form
  const { data: menuItems } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id, name, price, category")
        .eq("is_available", true)
        .order("category")
        .order("name");
      if (error) throw error;
      return data as MenuItem[];
    },
  });

  // Submit inquiry mutation
  const inquiryMutation = useMutation({
    mutationFn: async (data: typeof inquiryForm) => {
      const validated = inquirySchema.parse(data);
      const { error } = await supabase.from("inquiries").insert([{
        customer_name: validated.customer_name,
        email: validated.email,
        message: validated.message,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });
      setInquiryForm({ customer_name: "", email: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof z.ZodError
          ? error.errors[0].message
          : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit order mutation — saves to Google Sheets and then opens WhatsApp Click-to-Chat
  const orderMutation = useMutation({
    mutationFn: async (data: { form: typeof orderForm; items: OrderItem[] }) => {
      const validated = orderSchema.parse(data.form);

      if (data.items.length === 0) {
        throw new Error("Please add at least one item to your order");
      }

      const itemsDetailed = data.items.map((it) => {
        const menuItem = menuItems?.find((m) => m.id === it.menuItemId);
        const unitPrice = 7;
        return {
          id: it.menuItemId,
          name: menuItem?.name ?? "Unknown",
          quantity: it.quantity,
          price: unitPrice,
        };
      });

      const total = itemsDetailed.reduce((t, it) => t + it.price * it.quantity, 0);

      const payload = {
        order_date: new Date().toISOString(),
        customer_name: validated.customer_name,
        email: validated.email,
        phone: validated.phone || "",
        special_requests: validated.special_requests || "",
        items: itemsDetailed,
        total,
      };

      // Send to Google Sheets webhook (secret is appended by helper if configured)
      await sendOrderToSheets({ ...payload, secret: import.meta.env.VITE_GOOGLE_SHEETS_SECRET });

      return payload;
    },
    onSuccess: (payload: any) => {
      toast({
        title: "Order Submitted!",
        description: "Order saved — redirecting to WhatsApp.",
      });

      // Build the message and URL
      try {
        const message = formatWhatsAppMessage({
          orderDate: payload.order_date,
          form: {
            customer_name: payload.customer_name,
            email: payload.email,
            phone: payload.phone,
            special_requests: payload.special_requests,
          },
          items: payload.items,
          total: payload.total,
        });
        const url = buildWhatsAppUrl(message);

        // If we opened a window synchronously earlier, redirect it; otherwise try to open a new tab
        const win = pendingWindowRef.current;
        if (win && !win.closed) {
          try {
            win.location.href = url;
          } catch (err) {
            // Fallback if we can't set location (rare)
            try {
              window.open(url, "_blank");
            } catch (err2) {
              toast({ title: "Notice", description: "Could not open WhatsApp automatically. Please use the contact number provided to place your order." });
            }
          }
        } else {
          // No pre-opened window (or it was blocked/closed) — try to open one now
          const opened = window.open(url, "_blank");
          if (!opened) {
            toast({ title: "Notice", description: "Could not open WhatsApp automatically. Please allow popups or use the contact number provided." });
          }
        }
      } catch (err) {
        toast({ title: "Notice", description: "Could not open WhatsApp automatically. Please use the contact number provided." });
      } finally {
        pendingWindowRef.current = null;
      }

      setOrderForm({ customer_name: "", email: "", phone: "", special_requests: "" });
      setOrderItems([]);
    },
    onError: (error) => {
      // Close any pre-opened window to avoid leaving an unused blank tab
      try {
        pendingWindowRef.current?.close();
      } catch (e) {
        // ignore
      }
      pendingWindowRef.current = null;

      toast({
        title: "Error",
        description: error instanceof z.ZodError
          ? error.errors[0].message
          : error instanceof Error
            ? error.message
            : "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    },

  });

  const addToOrder = (menuItemId: string) => {
    const existing = orderItems.find((item) => item.menuItemId === menuItemId);
    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([...orderItems, { menuItemId, quantity: 1 }]);
    }
  };

  // Handle form submit: open a blank window synchronously (avoids popup blocker) and store ref
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Open a blank tab/window synchronously so the browser treats it as user-initiated
    try {
      const newWin = window.open("", "_blank");
      if (!newWin) {
        toast({
          title: "Popup blocked",
          description: "Please allow popups so WhatsApp can open automatically.",
          variant: "destructive",
        });
      }
      pendingWindowRef.current = newWin;
    } catch (err) {
      // ignore - will show a notice later if redirect fails
      pendingWindowRef.current = null;
    }

    orderMutation.mutate({ form: orderForm, items: orderItems });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setOrderItems((items) =>
      items
        .map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getOrderTotal = () => {
    const unitPrice = 7;
    return orderItems.reduce((total, item) => {
      return total + unitPrice * item.quantity;
    }, 0);
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading text-foreground">Get in Touch</h2>
          <p className="section-subheading">
            Have questions or ready to place an order? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-8 shadow-lg h-full">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
                Visit Us
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Address</h4>
                    <p className="text-muted-foreground">
                      Samosa Shop<br />
                      Balaji Tower Opposite<br />
                      No:1 Tollgate, Trichy 621216
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                    <p className="text-muted-foreground">+91 7550314901</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Hours</h4>
                    <p className="text-muted-foreground">
                      Mon - Sat: 4Pm - 8pm<br />
                      Sun: (Closed)
                    </p>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4">Send us a Message</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    inquiryMutation.mutate(inquiryForm);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="inquiry-name">Your Name</Label>
                    <Input
                      id="inquiry-name"
                      value={inquiryForm.customer_name}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, customer_name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiry-email">Email</Label>
                    <Input
                      id="inquiry-email"
                      type="email"
                      value={inquiryForm.email}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiry-message">Message</Label>
                    <Textarea
                      id="inquiry-message"
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, message: e.target.value })
                      }
                      placeholder="How can we help you?"
                      rows={4}
                      required
                      maxLength={1000}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={inquiryMutation.isPending}
                  >
                    {inquiryMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
                Place Your Order
              </h3>

              <form
                onSubmit={(e) => handleOrderSubmit(e)}
                className="space-y-8"
              >
                {/* Menu Items Selection */}
                <div>
                  <Label className="text-lg mb-4 block">Select Items</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {menuItems?.map((item) => {
                      const orderItem = orderItems.find((o) => o.menuItemId === item.id);
                      const quantity = orderItem?.quantity || 0;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-xl border-2 transition-all ${quantity > 0
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-foreground">{item.name}</h4>
                              <p className="text-sm text-primary font-semibold">
                                ₹7
                              </p>
                            </div>
                            {quantity === 0 ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => addToOrder(item.id)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  {quantity === 1 ? (
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  ) : (
                                    <Minus className="w-4 h-4" />
                                  )}
                                </Button>
                                <span className="w-8 text-center font-semibold">
                                  {quantity}
                                </span>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                {orderItems.length > 0 && (
                  <div className="p-4 rounded-xl bg-muted">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Order Total:</span>
                      <span className="text-primary">₹{getOrderTotal()}</span>
                    </div>
                  </div>
                )}

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order-name">Your Name *</Label>
                    <Input
                      id="order-name"
                      value={orderForm.customer_name}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, customer_name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-email">Email *</Label>
                    <Input
                      id="order-email"
                      type="email"
                      value={orderForm.email}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-phone">Phone (Optional)</Label>
                    <Input
                      id="order-phone"
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, phone: e.target.value })
                      }
                      placeholder="(555) 123-4567"
                      maxLength={20}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="order-requests">Special Requests</Label>
                    <Textarea
                      id="order-requests"
                      value={orderForm.special_requests}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, special_requests: e.target.value })
                      }
                      placeholder="Any dietary restrictions, allergies, or special instructions?"
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6"
                  disabled={orderMutation.isPending || orderItems.length === 0}
                >
                  {orderMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Submit Order Request
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  This is an order request. We'll contact you to confirm availability and arrange pickup/delivery.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;