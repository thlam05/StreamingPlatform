CREATE TABLE stream_likes (
    user_id UUID NOT NULL,
    stream_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, stream_id),
    CONSTRAINT fk_stream_likes_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_stream_likes_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id)
);

CREATE INDEX idx_stream_likes_stream
    ON stream_likes (stream_id, created_at DESC);
