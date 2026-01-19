const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function createRefUser() {
    const email = `ref_${Date.now()}@test.com`;
    const password = 'Password123!';

    console.log(`Creating user ${email}...`);
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: 'Ref User',
                role: 'normal'
            }
        }
    });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('User created:', data.user.id);
    }
}

createRefUser();
