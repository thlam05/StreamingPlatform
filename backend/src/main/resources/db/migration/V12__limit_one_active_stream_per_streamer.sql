-- A streamer may prepare multiple scheduled streams, but can only have one
-- active ingest session at a time. The database constraint closes the race
-- between concurrent publish callbacks or start requests.
CREATE UNIQUE INDEX uq_streams_one_active_per_streamer
    ON streams (streamer_id)
    WHERE status IN ('preview', 'live');
