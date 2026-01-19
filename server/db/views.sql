-- Run this in your Supabase SQL Editor to enable scalable sorting

CREATE OR REPLACE VIEW stores_with_ratings AS
SELECT 
    s.id,
    s.name,
    s.email,
    s.address,
    s.owner_id,
    s.created_at,
    COALESCE(AVG(r.rating), 0) as rating,
    COUNT(r.id) as rating_count
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
GROUP BY s.id;
