const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const users = [
    { email: 'owner1@store.com', password: 'Password123!', name: 'Owner One', address: '123 Market St', role: 'store_owner' },
    { email: 'owner2@store.com', password: 'Password123!', name: 'Owner Two', address: '456 Mall Ave', role: 'store_owner' },
    { email: 'user1@test.com', password: 'Password123!', name: 'User One', address: '789 User Ln', role: 'normal' },
    { email: 'user2@test.com', password: 'Password123!', name: 'User Two', address: '321 Customer Rd', role: 'normal' },
];

const stores = [
    { name: 'Tech Haven', email: 'contact@techhaven.com', address: 'Silicon Valley, CA' },
    { name: 'Fashion Forward', email: 'sales@fashionfwd.com', address: 'New York, NY' },
    { name: 'Gourmet Bites', email: 'yum@gourmetbites.com', address: 'Paris, France' },
    { name: "Bookworm's Paradise", email: "info@bookworm.com", address: "London, UK" },
    { name: "Fitness First", email: "contact@fitnessfirst.com", address: "Miami, FL" },
    { name: "Gadget Grove", email: "support@gadgetgrove.com", address: "Austin, TX" },
    { name: "Organic Oasis", email: "hello@organicoasis.com", address: "Portland, OR" },
    { name: "Urban Outfitters", email: "sales@urban.com", address: "Los Angeles, CA" }
];

async function seed() {
    console.log('Seeding Users...');
    const userIds = {};

    for (const u of users) {
        // Check if exists
        const { data: existing } = await supabase.from('users').select('id').eq('email', u.email).single();
        if (existing) {
            userIds[u.email] = existing.id;
        } else {
            const { data, error } = await supabase.rpc('create_new_user', u);
            if (error) {
                console.error(`Failed to create ${u.email}:`, error);
            } else {
                console.log(`Created ${u.email}`);
                userIds[u.email] = data;
            }
        }
    }

    // Need Admin ID for store creation? No, Admin creates them but owner_id can be anyone.
    // Let's assign stores to owners
    console.log('Seeding Stores...');
    const storeMap = [
        { ...stores[0], owner_email: 'owner1@store.com' },
        { ...stores[1], owner_email: 'owner2@store.com' },
        { ...stores[2], owner_email: 'owner1@store.com' },
        { ...stores[3], owner_email: 'owner2@store.com' },
        { ...stores[4], owner_email: 'owner1@store.com' },
        { ...stores[5], owner_email: 'owner2@store.com' },
        { ...stores[6], owner_email: 'owner1@store.com' },
        { ...stores[7], owner_email: 'owner2@store.com' },
    ];

    const createdStores = [];

    for (const s of storeMap) {
        const ownerId = userIds[s.owner_email];
        // Check if store exists
        const { data: existing } = await supabase.from('stores').select('id').eq('name', s.name).single();

        let storeId;
        if (existing) {
            storeId = existing.id;
        } else {
            const { data, error } = await supabase.from('stores').insert({
                name: s.name,
                email: s.email,
                address: s.address,
                owner_id: ownerId
            }).select().single();

            if (error) console.error(`Failed to create store ${s.name}:`, error);
            else storeId = data.id;
        }

        if (storeId) createdStores.push(storeId);
    }

    console.log('Seeding Ratings...');
    // user1 rates store 1 and 2
    if (userIds['user1@test.com'] && createdStores.length > 0) {
        await supabase.from('ratings').upsert([
            { user_id: userIds['user1@test.com'], store_id: createdStores[0], rating: 5 },
            { user_id: userIds['user1@test.com'], store_id: createdStores[1], rating: 4 },
        ], { onConflict: 'user_id,store_id' });
    }
    // user2 rates store 1 and 3
    if (userIds['user2@test.com'] && createdStores.length > 0) {
        await supabase.from('ratings').upsert([
            { user_id: userIds['user2@test.com'], store_id: createdStores[0], rating: 3 },
            { user_id: userIds['user2@test.com'], store_id: createdStores[2], rating: 5 },
        ], { onConflict: 'user_id,store_id' });
    }

    console.log('Seeding Complete!');
}

seed();
