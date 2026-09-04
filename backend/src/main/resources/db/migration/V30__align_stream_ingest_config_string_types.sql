ALTER TABLE stream_ingest_configs
    ALTER COLUMN stream_key_fingerprint TYPE VARCHAR(64)
        USING BTRIM(stream_key_fingerprint),
    ALTER COLUMN key_suffix TYPE VARCHAR(4)
        USING BTRIM(key_suffix);
