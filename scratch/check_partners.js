import { createClient } from './frontend/src/utils/supabase/client.js';

async function dumpPartners() {
    const supabase = createClient();
    const { data, error } = await supabase.from('partners').select('*');
    if (error) {
        console.error('Error fetching partners:', error);
        return;
    }
    console.log('Partners:', JSON.stringify(data, null, 2));
}

dumpPartners();
