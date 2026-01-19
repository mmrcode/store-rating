const supabase = require('../db');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch user role from public.users
        const { data: userDetails, error: detailsError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (detailsError) {
            return res.status(401).json({ error: 'User details not found' });
        }

        req.user = { ...user, ...userDetails };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authMiddleware, requireRole };
