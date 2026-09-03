CREATE TABLE follows (
    follower_id UUID NOT NULL,
    streamer_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, streamer_id),
    CONSTRAINT fk_follows_follower
        FOREIGN KEY (follower_id) REFERENCES users (id),
    CONSTRAINT fk_follows_streamer
        FOREIGN KEY (streamer_id) REFERENCES users (id),
    CONSTRAINT chk_follows_different_users
        CHECK (follower_id <> streamer_id)
);

CREATE INDEX idx_follows_streamer
    ON follows (streamer_id, created_at DESC);
