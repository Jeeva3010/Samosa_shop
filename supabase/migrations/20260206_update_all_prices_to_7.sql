-- Update all menu item prices to 7.00 (All categories)
UPDATE public.menu_items 
SET price = 7.00 
WHERE category IN ('samosas', 'sides', 'beverages');
