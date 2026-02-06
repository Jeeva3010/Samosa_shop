import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xwwlflqxubponyesksag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d2xmbHF4dWJwb255ZXNrc2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODYwMDUsImV4cCI6MjA4NTY2MjAwNX0.QtQcneD0e0muo1LS8YcGaDAeQHVqQWXDksKZ-QcL_vQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAndReinsert() {
    try {
        console.log('Updating menu items to price 7.00...');

        // First, fetch all items in those categories
        const { data: items, error: fetchError } = await supabase
            .from('menu_items')
            .select('*')
            .in('category', ['samosas', 'sides', 'beverages']);

        if (fetchError) {
            console.error('Error fetching items:', fetchError);
            return;
        }

        console.log('Found items:', items?.length);

        // Update each item individually
        for (const item of items || []) {
            const { error: updateError } = await supabase
                .from('menu_items')
                .update({ price: 7.00 })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Error updating ${item.name}:`, updateError);
            } else {
                console.log(`✅ Updated ${item.name} to ₹7.00`);
            }
        }

        // Verify updates
        const { data: updatedItems } = await supabase
            .from('menu_items')
            .select('*')
            .in('category', ['samosas', 'sides', 'beverages']);

        console.log('\n✅ Final menu items:');
        updatedItems?.forEach(item => {
            console.log(`  - ${item.name}: ₹${item.price}`);
        });
    } catch (err) {
        console.error('Error:', err);
    }
}

deleteAndReinsert();
