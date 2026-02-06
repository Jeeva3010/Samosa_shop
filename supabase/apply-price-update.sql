-- Run these commands in Supabase SQL Editor to enable price updates

-- Step 1: Add UPDATE policy if it doesn't exist
CREATE POLICY "Menu items are publicly updatable" 
ON public.menu_items 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Step 2: Update all menu item prices to 7.00
UPDATE public.menu_items 
SET price = 7.00 
WHERE category IN ('samosas', 'sides', 'beverages');

-- Step 3: Verify the updates
SELECT name, price, category FROM public.menu_items ORDER BY category, name;
