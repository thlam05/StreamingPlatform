CREATE TABLE stream_stats_daily (
    stream_id UUID NOT NULL,
    stat_date DATE NOT NULL,
    view_count BIGINT NOT NULL DEFAULT 0,
    unique_viewer_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    chat_message_count BIGINT NOT NULL DEFAULT 0,
    gift_count BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (stream_id, stat_date),
    CONSTRAINT fk_stream_stats_daily_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id),
    CONSTRAINT chk_stream_stats_daily_counts
        CHECK (
            view_count >= 0
            AND unique_viewer_count >= 0
            AND like_count >= 0
            AND chat_message_count >= 0
            AND gift_count >= 0
        )
);
