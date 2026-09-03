CREATE TABLE group_messages (
    id UUID PRIMARY KEY,
    group_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    message_text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_group_messages_group
        FOREIGN KEY (group_id) REFERENCES "groups" (id),
    CONSTRAINT fk_group_messages_sender
        FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT chk_group_messages_status
        CHECK (status IN ('visible', 'hidden', 'deleted', 'flagged'))
);

CREATE INDEX idx_group_messages_group_created
    ON group_messages (group_id, created_at DESC);

CREATE INDEX idx_group_messages_sender
    ON group_messages (sender_id, created_at DESC);
