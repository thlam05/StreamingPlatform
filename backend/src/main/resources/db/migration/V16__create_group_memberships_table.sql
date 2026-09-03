CREATE TABLE group_memberships (
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    joined_at TIMESTAMPTZ,
    PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_group_memberships_group
        FOREIGN KEY (group_id) REFERENCES "groups" (id),
    CONSTRAINT fk_group_memberships_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT chk_group_memberships_role
        CHECK (role IN ('member', 'moderator', 'owner')),
    CONSTRAINT chk_group_memberships_status
        CHECK (status IN ('pending', 'active', 'blocked', 'left'))
);

CREATE INDEX idx_group_memberships_user_status
    ON group_memberships (user_id, status, joined_at DESC);
