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
