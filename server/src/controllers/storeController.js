const supabase = require('../db');

exports.getStores = async (req, res) => {
    // Return stores with ratings
    // For Admin: Name, Email, Address, Rating
    // For User: Name, Address, Overall Rating, User's Rating

    const { role, id: userId } = req.user;
    const { search, filter } = req.query;

    // Base query
    let query = supabase.from('stores').select(`
        *,
        ratings (
            rating,
            user_id
        )
    `);

    // Search by Name or Address or Email
    if (search) {
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Sorting
    if (req.query.sort) {
        const [field, order] = req.query.sort.split(':'); // e.g., name:asc
        if (field === 'rating') {
            // Sorting by calculated field (rating) is hard in SQL/Supabase without a view or computed column.
            // We will sort in memory after fetching for now.
        } else {
            query = query.order(field, { ascending: order === 'asc' });
        }
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: stores, error } = await query;

    if (error) return res.status(400).json({ error: error.message });

    // Process ratings
    let result = stores.map(store => {
        const ratings = store.ratings || [];
        const count = ratings.length;
        const sum = ratings.reduce((a, b) => a + b.rating, 0);
        const avgRating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;

        // Custom fields based on role
        if (role === 'admin') {
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                rating: avgRating,
                owner_id: store.owner_id
            };
        } else if (role === 'normal') {
            const myRating = ratings.find(r => r.user_id === userId);
            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating: avgRating,
                myRating: myRating ? myRating.rating : null
            };
        } else {
            // Store Owner or generic
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                rating: avgRating
            };
        }
    });

    // In-memory sort for rating
    if (req.query.sort) {
        const [field, order] = req.query.sort.split(':');
        if (field === 'rating') {
            result.sort((a, b) => {
                const ra = a.rating || a.overallRating || 0;
                const rb = b.rating || b.overallRating || 0;
                return order === 'asc' ? ra - rb : rb - ra;
            });
        }
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
            user: r.users.name,
            email: r.users.email,
            rating: r.rating,
            date: r.updated_at
        }))
    });
};
