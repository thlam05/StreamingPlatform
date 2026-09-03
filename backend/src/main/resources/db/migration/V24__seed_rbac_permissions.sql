INSERT INTO permissions (id, code, name, description, resource, action)
VALUES
    ('00000000-0000-0000-0000-000000000101', 'user:read', 'Read users', 'Read user profiles', 'user', 'read'),
    ('00000000-0000-0000-0000-000000000102', 'user:update', 'Update users', 'Update user profiles', 'user', 'update'),
    ('00000000-0000-0000-0000-000000000201', 'stream:read', 'Read streams', 'Read streams', 'stream', 'read'),
    ('00000000-0000-0000-0000-000000000202', 'stream:create', 'Create streams', 'Create streams', 'stream', 'create'),
    ('00000000-0000-0000-0000-000000000203', 'stream:update', 'Update streams', 'Update streams', 'stream', 'update'),
    ('00000000-0000-0000-0000-000000000204', 'stream:delete', 'Delete streams', 'Delete streams', 'stream', 'delete'),
    ('00000000-0000-0000-0000-000000000205', 'stream:moderate', 'Moderate streams', 'Moderate streams', 'stream', 'moderate'),
    ('00000000-0000-0000-0000-000000000206', 'stream:stats:read', 'Read stream statistics', 'Read stream statistics', 'stream', 'stats:read'),
    ('00000000-0000-0000-0000-000000000301', 'chat:send', 'Send chat messages', 'Send chat messages', 'chat', 'send'),
    ('00000000-0000-0000-0000-000000000302', 'chat:moderate', 'Moderate chat', 'Moderate chat messages', 'chat', 'moderate'),
    ('00000000-0000-0000-0000-000000000401', 'post:create', 'Create posts', 'Create posts', 'post', 'create'),
    ('00000000-0000-0000-0000-000000000402', 'post:update', 'Update posts', 'Update posts', 'post', 'update'),
    ('00000000-0000-0000-0000-000000000403', 'post:delete', 'Delete posts', 'Delete posts', 'post', 'delete'),
    ('00000000-0000-0000-0000-000000000501', 'rbac:manage', 'Manage authorization', 'Manage roles and permissions', 'rbac', 'manage')
ON CONFLICT (code) DO NOTHING;
