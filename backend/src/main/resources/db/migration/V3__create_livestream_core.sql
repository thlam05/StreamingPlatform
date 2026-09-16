-- Categories form a two-level tree used by streams.
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    parent_id UUID,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    level SMALLINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_categories_slug UNIQUE (slug),
    CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_id) REFERENCES categories (id),
    CONSTRAINT chk_categories_level CHECK (level IN (1, 2)),
    CONSTRAINT chk_categories_parent_by_level
        CHECK ((level = 1 AND parent_id IS NULL) OR (level = 2 AND parent_id IS NOT NULL)),
    CONSTRAINT chk_categories_status CHECK (status IN ('active', 'inactive'))
);

CREATE UNIQUE INDEX uq_categories_top_level_name
    ON categories (name)
    WHERE parent_id IS NULL;

CREATE UNIQUE INDEX uq_categories_child_name
    ON categories (parent_id, name)
    WHERE parent_id IS NOT NULL;

CREATE INDEX idx_categories_parent_status
    ON categories (parent_id, status);

-- Stream lifecycle columns live here from the beginning; no follow-up ALTER migration is needed.
CREATE TABLE streams (
    id UUID PRIMARY KEY,
    streamer_id UUID NOT NULL,
    category_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    playback_url TEXT,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    scheduled_expires_at TIMESTAMPTZ,
    ingest_client_id VARCHAR(128),
    unpublish_pending_at TIMESTAMPTZ,
    start_requested_at TIMESTAMPTZ,
    start_request_expires_at TIMESTAMPTZ,
    publish_observed_at TIMESTAMPTZ,
    publish_session_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_streams_streamer
        FOREIGN KEY (streamer_id) REFERENCES users (id),
    CONSTRAINT fk_streams_category
        FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT chk_streams_status
        CHECK (status IN ('scheduled', 'preview', 'live', 'ended', 'cancelled')),
    CONSTRAINT chk_streams_time_range
        CHECK (ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at)
);

CREATE INDEX idx_streams_streamer_status
    ON streams (streamer_id, status, created_at DESC);

CREATE INDEX idx_streams_category_status
    ON streams (category_id, status, created_at DESC);

CREATE INDEX idx_streams_status_created
    ON streams (status, created_at DESC);

CREATE INDEX idx_streams_scheduled_expiry
    ON streams (scheduled_expires_at)
    WHERE status = 'scheduled';

CREATE INDEX idx_streams_live_unpublish_pending
    ON streams (unpublish_pending_at)
    WHERE status = 'live' AND unpublish_pending_at IS NOT NULL;

CREATE INDEX idx_streams_publisher_confirmation
    ON streams (publish_observed_at)
    WHERE status = 'scheduled' AND publish_observed_at IS NOT NULL;

CREATE INDEX idx_streams_start_request_expiry
    ON streams (start_request_expires_at)
    WHERE status = 'scheduled' AND start_request_expires_at IS NOT NULL;
