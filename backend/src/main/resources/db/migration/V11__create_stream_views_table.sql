CREATE TABLE stream_views (
    id UUID PRIMARY KEY,
    stream_id UUID NOT NULL,
    viewer_id UUID,
    session_id VARCHAR(100) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,
    CONSTRAINT fk_stream_views_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id),
    CONSTRAINT fk_stream_views_viewer
        FOREIGN KEY (viewer_id) REFERENCES users (id),
    CONSTRAINT chk_stream_views_time_range
        CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE INDEX idx_stream_views_stream_started
    ON stream_views (stream_id, started_at DESC);

CREATE INDEX idx_stream_views_viewer
    ON stream_views (viewer_id, started_at DESC);

CREATE UNIQUE INDEX uq_stream_views_stream_session
    ON stream_views (stream_id, session_id);
