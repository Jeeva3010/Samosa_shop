import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xwwlflqxubponyesksag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d2xmbHF4dWJwb255ZXNrc2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODYwMDUsImV4cCI6MjA4NTY2MjAwNX0.QtQcneD0e0muo1LS8YcGaDAeQHVqQWXDksKZ-QcL_vQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePrices() {
    try {
        console.log('Updating all menu item prices to 7.00...');

        const { data, error } = await supabase
            .from('menu_items')
            .update({ price: 7.00 })
            .in('category', ['samosas', 'sides', 'beverages']);

        if (error) {
            console.error('Error updating prices:', error);
            process.exit(1);
        }

        console.log('✅ Successfully updated prices!');

        const { data: items } = await supabase
            .from('menu_items')
            .select('*')
            .in('category', ['samosas', 'sides', 'beverages']);

        console.log('\nUpdated menu items:');
        items?.forEach(item => {
            console.log(`  - ${item.name}: ₹${item.price}`);
        });
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updatePrices();
