DELETE FROM role_permissions
WHERE role_id IN (
    SELECT id
    FROM roles
    WHERE name IN ('viewer', 'streamer')
)
AND permission_id = (
    SELECT id
    FROM permissions
    WHERE code = 'user:update'
);
