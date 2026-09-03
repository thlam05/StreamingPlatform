CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    stream_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    message_text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_chat_messages_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id),
    CONSTRAINT fk_chat_messages_sender
        FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT chk_chat_messages_status
        CHECK (status IN ('pending', 'visible', 'hidden', 'blocked', 'flagged'))
);

CREATE INDEX idx_chat_messages_stream_created
    ON chat_messages (stream_id, created_at DESC);

CREATE INDEX idx_chat_messages_sender
    ON chat_messages (sender_id, created_at DESC);
