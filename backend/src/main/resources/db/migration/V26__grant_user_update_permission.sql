INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code = 'user:update'
WHERE r.name IN ('viewer', 'streamer')
ON CONFLICT DO NOTHING;
