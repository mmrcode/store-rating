const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testApi() {
    console.log("1. Logging in as user1@test.com...");
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'user1@test.com',
        password: 'Password123!'
    });

    if (authError) {
        console.error("Auth Failed:", authError.message);
        return;
    }

    const token = session.access_token;
    console.log("   -> Login Successful. Toekn obtained.");

    console.log("\n2. Requesting GET http://localhost:3000/api/stores...");
    try {
        const response = await fetch('http://localhost:3000/api/stores', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("   -> Status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error("   -> API Request Failed:", errText);
            return;
        }

        const data = await response.json();
        console.log("   -> Data Length:", data.length);
        if (data.length > 0) {
            console.log("   -> First Item:", data[0]);
        } else {
            console.log("   -> Data is empty []");
        }

    } catch (err) {
        console.error("   -> Request Error:", err.message);
    }
}

testApi();
