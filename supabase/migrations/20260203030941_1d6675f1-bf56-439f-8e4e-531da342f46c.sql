-- Create menu categories enum
CREATE TYPE public.menu_category AS ENUM ('samosas', 'sides', 'beverages');

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category menu_category NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on menu_items (public read access)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Everyone can read menu items
CREATE POLICY "Menu items are publicly viewable" 
ON public.menu_items 
FOR SELECT 
USING (true);

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Anyone can submit inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an order
CREATE POLICY "Anyone can submit orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_order DECIMAL(10,2) NOT NULL
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can add order items (when creating an order)
CREATE POLICY "Anyone can add order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Insert initial menu items
INSERT INTO public.menu_items (name, description, price, category) VALUES
  ('Samosa', 'Crispy golden pastry filled with spiced potatoes and peas, deep-fried to perfection', 2.50, 'samosas'),
  ('Valakai Baji', 'Spicy green chillies dipped in chickpea batter and fried until crispy', 3.00, 'sides'),
  ('Paruppu Vadai', 'Sweet fried dough balls coated in sugar syrup, a delightful treat', 2.00, 'sides'),
  ('Ullunthu Vadai', 'Traditional South Indian lentil fritters, crispy outside and soft inside', 2.50, 'sides'),
  ('Chilli Baji', 'Savory lentil patties seasoned with aromatic spices and herbs', 2.50, 'sides');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for menu_items timestamp
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

