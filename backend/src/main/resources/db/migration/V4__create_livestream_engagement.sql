CREATE TABLE follows (
    follower_id UUID NOT NULL,
    streamer_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_follows PRIMARY KEY (follower_id, streamer_id),
    CONSTRAINT fk_follows_follower
        FOREIGN KEY (follower_id) REFERENCES users (id),
    CONSTRAINT fk_follows_streamer
        FOREIGN KEY (streamer_id) REFERENCES users (id),
    CONSTRAINT chk_follows_different_users CHECK (follower_id <> streamer_id)
);

CREATE INDEX idx_follows_streamer
    ON follows (streamer_id, created_at DESC);

CREATE TABLE stream_likes (
    user_id UUID NOT NULL,
    stream_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_stream_likes PRIMARY KEY (user_id, stream_id),
    CONSTRAINT fk_stream_likes_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_stream_likes_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id)
);

CREATE INDEX idx_stream_likes_stream
    ON stream_likes (stream_id, created_at DESC);

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
        CHECK (ended_at IS NULL OR ended_at >= started_at),
    CONSTRAINT uq_stream_views_stream_session UNIQUE (stream_id, session_id)
);

CREATE INDEX idx_stream_views_stream_started
    ON stream_views (stream_id, started_at DESC);

CREATE INDEX idx_stream_views_viewer
    ON stream_views (viewer_id, started_at DESC);

CREATE TABLE stream_stats_daily (
    stream_id UUID NOT NULL,
    stat_date DATE NOT NULL,
    view_count BIGINT NOT NULL DEFAULT 0,
    unique_viewer_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    chat_message_count BIGINT NOT NULL DEFAULT 0,
    gift_count BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT pk_stream_stats_daily PRIMARY KEY (stream_id, stat_date),
    CONSTRAINT fk_stream_stats_daily_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id),
    CONSTRAINT chk_stream_stats_daily_counts CHECK (
        view_count >= 0
        AND unique_viewer_count >= 0
        AND like_count >= 0
        AND chat_message_count >= 0
        AND gift_count >= 0
    )
);
