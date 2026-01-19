const supabase = require('../db');

exports.getUsers = async (req, res) => {
    const { role, search, sort } = req.query; // e.g. sort=name:asc

    let query = supabase.from('users').select(`
        *,
        stores (
            id,
            ratings (rating)
        )
    `);

    if (role) {
        query = query.eq('role', role);
    }

    if (search) {
        // Simple search on name or email or address
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,address.ilike.%${search}%`);
    }

    if (sort) {
        const [field, order] = sort.split(':');
        query = query.order(field, { ascending: order === 'asc' });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });

    // Process to add store rating for owners
    const result = data.map(user => {
        let storeRating = null;
        if (user.role === 'store_owner' && user.stores && user.stores.length > 0) {
            // Calculate avg rating of their first store (or all stores?)
            // Requirement: "See the average rating of their store."
            const store = user.stores[0];
            if (store.ratings && store.ratings.length > 0) {
                const sum = store.ratings.reduce((a, b) => a + b.rating, 0);
                storeRating = (sum / store.ratings.length).toFixed(1);
            } else {
                storeRating = 'N/A';
            }
        }

        return {
            ...user,
            storeRating
        };
    });

    res.json(result);
};

exports.getUserDetails = async (req, res) => {
    const { id } = req.params;

    // Get basic details
    const { data: user, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) return res.status(400).json({ error: error.message });

    // If store owner, get their rating? 
    // "If the user is a Store Owner, their Rating should also be displayed."
    // What rating? Accessing avg rating of their store?
    // "Store Owner... See the average rating of their store."
    // The requirement says "If the user is a Store Owner, their Rating should also be displayed."
    // Maybe the Store Owner HAS a Store linked to them?
    // Currently Schema: Store doesn't have owner_id? 
    // "Store Owner... View a list of users who have submitted ratings for THEIR store."
    // IMPLIES Store Owner owns a store.
    // I missed `owner_id` on Stores table.

    // I need to add `owner_id` to `stores`.

    res.json(user);
};

exports.createUser = async (req, res) => {
    // Admin only
    const { email, password, name, address, role } = req.body;

    // Validate password (min 8 chars, 1 upper, 1 special)
    // Regex: ^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be 8-16 chars, include uppercase and special char.' });
    }

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ error: 'Name must be 20-60 characters.' });
    }

    if (address.length > 400) {
        return res.status(400).json({ error: 'Address max 400 chars.' });
    }

    const { data, error } = await supabase.rpc('create_new_user', {
        email,
        password,
        name,
        address,
        role
    });

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'User created', userId: data });
};

exports.updatePassword = async (req, res) => {
    const { password } = req.body;

    // Validate
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Invalid password format' });
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password updated successfully' });
};
