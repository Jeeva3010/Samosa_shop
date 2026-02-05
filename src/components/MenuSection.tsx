import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import samosa1 from "@/assets/images/samosa 1.png";
import samosa2 from "@/assets/images/samosa 2.png";
import samosa3 from "@/assets/images/samosa 3.png";
import chilli from "@/assets/images/img2.jpg";
import valakai from "@/assets/images/valakaibajji.jpg";
import vadai from "@/assets/images/paruppuvadai.jpg";
import ulundhavadai from "@/assets/images/ulunthuvadai.jpg";


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

// Samosa images rotation
const samosaImages = [samosa1, samosa2, samosa3];

// Side dish images rotation
const sideImages = [chilli, valakai, vadai, ulundhavadai];

const getSamosaImage = (index: number) => {
  return samosaImages[index % samosaImages.length];
};

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

            // Ensure we always render three samosa showcase cards.
            const displayCards = Array.from({ length: 3 }).map((_, i) => {
              const src = items[i];
              if (src) return src;
              // Fallback placeholder using provided samosa images
              return {
                id: `samosa-placeholder-${i}`,
                name: i === 0 ? items[0]?.name ?? `Samosa ${i + 1}` : `Samosa ${i + 1}`,
                description: items[0]?.description ?? "A delicious traditional treat.",
                price: items[0]?.price ?? 2.5,
                image_url: samosaImages[i] || samosa1,
              } as MenuItem;
            });

            return (
              <div key={category}>
                {/* Category Header */}
                <div className="spice-divider">
                  <span className="text-2xl font-display font-semibold text-foreground px-4">
                    {categoryLabels[category] || category}
                  </span>
                </div>


                  {/* Featured Images with Description for Samosas (3 equal cards) */}
                  {category === "samosas" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                      {displayCards.map((item, idx) => (
                        <div key={item.id} className="text-center group">
                          <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
                            <img
                              src={item.image_url || samosaImages[idx] || samosa1}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                            {item.name}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {item.description || "A delicious traditional treat."}
                          </p>
                          <span className="text-lg font-bold text-primary">
                            ₹{item.price ?? "2.5"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Menu Items Grid for Sides (4 columns) */}
                {category === "sides" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {items.slice(0, 4).map((item, idx) => (
                      <div key={item.id} className="text-center group">
                        <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
                          <img
                            src={sideImages[idx] || chilli}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {item.description || "A delicious traditional treat."}
                        </p>
                        <span className="text-lg font-bold text-primary">
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Menu Items Grid for Beverages */}
                {category === "beverages" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {items.map((item) => (
                    <div key={item.id} className="menu-card group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                      {/* Image Container */}
                      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">🍵</span>
                      </div>
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-display font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <span className="text-xl font-bold text-primary whitespace-nowrap">
                            ₹{item.price}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description || "A delicious traditional treat."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;