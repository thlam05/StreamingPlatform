INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('user:read', 'stream:read', 'chat:send', 'post:create')
WHERE r.name = 'viewer'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'user:read', 'stream:read', 'stream:create', 'stream:update',
    'stream:delete', 'stream:stats:read', 'chat:send', 'post:create',
    'post:update', 'post:delete'
)
WHERE r.name = 'streamer'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON TRUE
WHERE r.name = 'administrator'
ON CONFLICT DO NOTHING;
