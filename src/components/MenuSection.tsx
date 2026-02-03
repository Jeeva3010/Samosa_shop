import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_available: boolean;
  image_url: string | null;
}

const categoryLabels: Record<string, string> = {
  samosas: "🥟 Samosas",
  sides: "🍽️ Sides & Snacks",
  beverages: "🍵 Beverages",
};

const categoryOrder = ["samosas", "sides", "beverages"];

const MenuSection = () => {
  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("category")
        .order("name");

      if (error) throw error;
      return data as MenuItem[];
    },
  });

  const groupedItems = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (isLoading) {
    return (
      <section id="menu" className="py-20 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Failed to load menu. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading text-foreground">Our Menu</h2>
          <p className="section-subheading">
            Discover our selection of authentic Indian street food,
            crafted with traditional spices and fresh ingredients.
          </p>
        </div>

        {/* Menu Categories */}
        <div className="space-y-16">
          {categoryOrder.map((category) => {
            const items = groupedItems?.[category];
            if (!items || items.length === 0) return null;

            return (
              <div key={category}>
                {/* Category Header */}
                <div className="spice-divider">
                  <span className="text-2xl font-display font-semibold text-foreground px-4">
                    {categoryLabels[category] || category}
                  </span>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {items.map((item) => (
                    <div key={item.id} className="menu-card group">
                      {/* Image Placeholder */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">
                          {category === "samosas" ? "🥟" : category === "beverages" ? "🍵" : "🍽️"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-display font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <span className="text-xl font-bold text-primary whitespace-nowrap">
                            ₹7
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description || "A delicious traditional treat."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;