CREATE TABLE stream_ingest_configs (
    id UUID PRIMARY KEY,
    stream_id UUID NOT NULL,
    rtmp_url TEXT NOT NULL,
    stream_key_ciphertext BYTEA NOT NULL,
    stream_key_fingerprint CHAR(64) NOT NULL UNIQUE,
    key_suffix CHAR(4),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rotated_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    CONSTRAINT fk_stream_ingest_configs_stream
        FOREIGN KEY (stream_id) REFERENCES streams (id),
    CONSTRAINT chk_stream_ingest_configs_status
        CHECK (status IN ('active', 'revoked')),
    CONSTRAINT chk_stream_ingest_configs_dates
        CHECK (
            (rotated_at IS NULL OR rotated_at >= created_at)
            AND (revoked_at IS NULL OR revoked_at >= created_at)
            AND (last_used_at IS NULL OR last_used_at >= created_at)
        )
);

CREATE INDEX idx_stream_ingest_configs_stream_created
    ON stream_ingest_configs (stream_id, created_at DESC);

CREATE UNIQUE INDEX uq_stream_ingest_configs_active_stream
    ON stream_ingest_configs (stream_id)
    WHERE status = 'active';
