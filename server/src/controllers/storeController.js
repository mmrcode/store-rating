const supabase = require('../db');

exports.getStores = async (req, res) => {
    // Uses 'stores_with_ratings' VIEW for scalable sorting
    const { role, id: userId } = req.user;
    const { search } = req.query;

    let query = supabase.from('stores_with_ratings').select('*');

    // Search
    if (search) {
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Sorting (Database Level)
    if (req.query.sort) {
        const [field, order] = req.query.sort.split(':');
        // 'rating' column now exists in the VIEW
        query = query.order(field, { ascending: order === 'asc' });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: stores, error } = await query;

    if (error) {
        // Fallback for when View is not created yet (Optional robustness)
        if (error.code === '42P01') { // undefined_table
            return res.status(500).json({ error: "Database View missing. Please run 'server/db/views.sql' in Supabase." });
        }
        return res.status(400).json({ error: error.message });
    }

    // Transform for response if needed
    // The view returns: id, name, email, address, owner_id, rating, rating_count
    // We might need to fetch 'myRating' for normal users still.

    let result = stores;

    // Append 'myRating' for Normal users. 
    // This part is less efficient but necessary unless we have a complex view with user context.
    // For scalability with millions of stores, you'd fetch myRatings separately and merge in UI.
    // For now, let's keep it simple or do a second query.
    if (role === 'normal') {
        const { data: myRatings } = await supabase.from('ratings')
            .select('store_id, rating')
            .eq('user_id', userId);

        const myRatingMap = new Map(myRatings?.map(r => [r.store_id, r.rating]));

        result = stores.map(s => ({
            ...s,
            overallRating: s.rating, // View uses 'rating' column
            myRating: myRatingMap.get(s.id) || null
        }));
    } else {
        // Normalize fields if view names differ
        result = stores.map(s => ({
            ...s,
            rating: s.rating // Ensure consistency
        }));
    }

    res.json(result);
};

exports.getStats = async (req, res) => {
    // Admin only
    try {
        const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: storesCount } = await supabase.from('stores').select('*', { count: 'exact', head: true });
        const { count: ratingsCount } = await supabase.from('ratings').select('*', { count: 'exact', head: true });

        res.json({
            users: usersCount,
            stores: storesCount,
            ratings: ratingsCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStore = async (req, res) => {
    // Admin only
    const { name, email, address, owner_id } = req.body;

    const { data, error } = await supabase.from('stores').insert({
        name,
        email,
        address,
        owner_id // Optional
    }).select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

exports.submitRating = async (req, res) => {
    // Normal User only
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if rating already exists
    const { data: existing } = await supabase.from('ratings').select('*').match({ user_id: userId, store_id: storeId }).single();

    let query;
    if (existing) {
        // Update
        query = supabase.from('ratings').update({ rating, updated_at: new Date() }).eq('id', existing.id);
    } else {
        // Insert
        query = supabase.from('ratings').insert({ user_id: userId, store_id: storeId, rating });
    }

    const { data, error } = await query.select();
    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
};

exports.getStoreDashboard = async (req, res) => {
    // Store Owner only
    // View users who submitted ratings for THEIR store
    // See average rating

    const userId = req.user.id;

    // Find store owned by user
    const { data: store, error: storeError } = await supabase.from('stores').select('*').eq('owner_id', userId).single();

    if (storeError || !store) {
        return res.status(404).json({ error: 'No store found for this owner' });
    }

    // Get ratings with user details
    const { data: ratings, error: ratingsError } = await supabase.from('ratings')
        .select('rating, updated_at, users(name, email)')
        .eq('store_id', store.id);

    if (ratingsError) return res.status(400).json({ error: ratingsError.message });

    // Calculate Average
    const count = ratings.length;
    const sum = ratings.reduce((a, b) => a + b.rating, 0);
    const avg = count > 0 ? (sum / count).toFixed(1) : 0;

    res.json({
        storeName: store.name,
        averageRating: avg,
        ratings: ratings.map(r => ({
            user: r.users?.name || 'Unknown User',
            email: r.users?.email || 'N/A',
            rating: r.rating,
            date: r.updated_at
        }))
    });
};
