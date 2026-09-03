CREATE TABLE gift_transactions (
    id UUID PRIMARY KEY,
    gift_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    streamer_id UUID NOT NULL,
    stream_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    amount NUMERIC(12, 2),
    currency VARCHAR(10),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gift_transactions_gift
        FOREIGN KEY (gift_id) REFERENCES gift_catalog (id),
    CONSTRAINT fk_gift_transactions_sender
        FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT fk_gift_transactions_streamer
        FOREIGN KEY (streamer_id) REFERENCES users (id),
    CONSTRAINT fk_gift_transactions_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id),
    CONSTRAINT chk_gift_transactions_quantity
        CHECK (quantity > 0),
    CONSTRAINT chk_gift_transactions_amount
        CHECK (amount IS NULL OR amount >= 0),
    CONSTRAINT chk_gift_transactions_status
        CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

CREATE INDEX idx_gift_transactions_stream_created
    ON gift_transactions (stream_id, created_at DESC);

CREATE INDEX idx_gift_transactions_sender_created
    ON gift_transactions (sender_id, created_at DESC);

CREATE INDEX idx_gift_transactions_streamer_created
    ON gift_transactions (streamer_id, created_at DESC);
