CREATE TABLE streams (
    id UUID PRIMARY KEY,
    streamer_id UUID NOT NULL,
    category_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_streams_streamer
        FOREIGN KEY (streamer_id) REFERENCES users (id),
    CONSTRAINT fk_streams_category
        FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT chk_streams_status
        CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    CONSTRAINT chk_streams_time_range
        CHECK (ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at)
);

CREATE INDEX idx_streams_streamer_status
    ON streams (streamer_id, status, created_at DESC);

CREATE INDEX idx_streams_category_status
    ON streams (category_id, status, created_at DESC);

CREATE INDEX idx_streams_status_created
    ON streams (status, created_at DESC);
