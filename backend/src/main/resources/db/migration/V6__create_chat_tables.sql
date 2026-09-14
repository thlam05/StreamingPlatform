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

CREATE TABLE moderation_results (
    id UUID PRIMARY KEY,
    chat_message_id UUID NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    toxicity_score NUMERIC(5, 4) NOT NULL,
    category VARCHAR(50),
    decision VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_moderation_results_message
        FOREIGN KEY (chat_message_id) REFERENCES chat_messages (id),
    CONSTRAINT chk_moderation_results_toxicity
        CHECK (toxicity_score BETWEEN 0 AND 1),
    CONSTRAINT chk_moderation_results_decision
        CHECK (decision IN ('allow', 'hide', 'block', 'flag'))
);

CREATE INDEX idx_moderation_results_message
    ON moderation_results (chat_message_id, created_at DESC);

CREATE INDEX idx_moderation_results_decision
    ON moderation_results (decision, created_at DESC);
