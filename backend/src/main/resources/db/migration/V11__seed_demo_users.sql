-- Development accounts. Replace/remove these seeds before using a production database.
INSERT INTO users (
    id, username, email, password, display_name, avatar_url, status
)
VALUES
    (
        '00000000-0000-0000-0000-000000000010',
        'admin',
        'admin@streaming.local',
        '$2a$10$NlhVa84Gp0Om76n2bzgfx.l.KUCQpfanpgcz357bJKxHu2ml/FSBu',
        'Administrator',
        NULL,
        'active'
    ),
    (
        '00000000-0000-0000-0000-000000000011',
        'streamer',
        'streamer@streaming.local',
        '$2a$10$NlhVa84Gp0Om76n2bzgfx.l.KUCQpfanpgcz357bJKxHu2ml/FSBu',
        'Streamer',
        NULL,
        'active'
    );

INSERT INTO user_roles (user_id, role_id)
VALUES
    (
        '00000000-0000-0000-0000-000000000010',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000011',
        '00000000-0000-0000-0000-000000000002'
    );
