INSERT INTO users (
    id,
    username,
    email,
    password,
    display_name,
    avatar_url,
    status,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'streamer',
    'streamer@streaming.local',
    '$2a$10$NlhVa84Gp0Om76n2bzgfx.l.KUCQpfanpgcz357bJKxHu2ml/FSBu',
    'Streamer',
    NULL,
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'streamer'
WHERE u.username = 'streamer'
  AND u.email = 'streamer@streaming.local'
ON CONFLICT DO NOTHING;
