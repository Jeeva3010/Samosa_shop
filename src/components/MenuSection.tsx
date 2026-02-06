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

const categoryLabels = {
  samosas: "🥟 Samosas",
  sides: "🍽️ Sides & Snacks",
  beverages: "🍵 Beverages",
};

const categoryOrder = ["samosas", "sides", "beverages"];

const samosaImages = [samosa1, samosa2, samosa3];
const sideImages = [chilli, valakai, vadai, ulundhavadai];

const FIXED_PRICE = 7;

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
      return data;
    },
  });

  const groupedItems = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <section className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center text-red-500">
        Failed to load menu
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Our Menu</h2>
          <p className="text-muted-foreground">
            Authentic Indian street food
          </p>
        </div>

        {categoryOrder.map((category) => {
          const items = groupedItems?.[category];
          if (!items?.length) return null;

          return (
            <div key={category} className="mb-16">

              <h3 className="text-2xl font-semibold mb-8 text-center">
                {categoryLabels[category]}
              </h3>

              {/* SAMOSAS */}
              {category === "samosas" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="text-center">
                      <img
                        src={samosaImages[i]}
                        className="h-80 w-full object-cover rounded-lg"
                        alt="Samosa"
                      />
                      <h4 className="mt-3 font-semibold">Samosa</h4>
                      <p className="text-primary font-bold">₹{FIXED_PRICE}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* SIDES */}
              {category === "sides" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {items.slice(0, 4).map((item, idx) => (
                    <div key={item.id} className="text-center">
                      <img
                        src={sideImages[idx]}
                        className="h-72 w-full object-cover rounded-lg"
                        alt={item.name}
                      />
                      <h4 className="mt-3 font-semibold">{item.name}</h4>
                      <p className="text-primary font-bold">₹{FIXED_PRICE}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* BEVERAGES */}
              {category === "beverages" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-6 text-center"
                    >
                      <span className="text-5xl">🍵</span>
                      <h4 className="mt-3 font-semibold">{item.name}</h4>
                      <p className="text-primary font-bold">₹{FIXED_PRICE}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MenuSection;
