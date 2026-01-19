const supabase = require('../db');

exports.signup = async (req, res) => {
    const { email, password, name, address } = req.body;

    try {
        // Call the RPC function to create a simplified user
        // For public signup, we default role to 'normal'
        const { data, error } = await supabase.rpc('create_new_user', {
            email,
            password,
            name,
            address,
            role: 'normal'
        });

        if (error) throw error;

        res.status(201).json({ message: 'User created successfully', userId: data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login Error:', error);
            throw error;
        }

        // Fetch additional user details from public.users
        const { data: userDetails, error: detailsError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (detailsError) {
            // Fallback if public.users sync failed? But creating user via RPC should ensure sync.
            console.error('Error fetching user details:', detailsError);
            // If we can't get details, we might still return the user but without role?
            // Let's throw to see if this is the cause
            throw new Error(`Public User Fetch Error: ${detailsError.message}`);
        }

        res.json({
            token: session.access_token,
            user: {
                ...user,
                ...userDetails // Role, Address, Name
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    // Client side should discard token. 
    // Ideally backend can call signOut but we are stateless with JWT mostly.
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Logged out successfully' });
};
