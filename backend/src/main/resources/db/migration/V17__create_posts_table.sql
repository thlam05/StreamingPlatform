CREATE TABLE posts (
    id UUID PRIMARY KEY,
    author_id UUID NOT NULL,
    group_id UUID,
    visibility VARCHAR(20) NOT NULL DEFAULT 'public',
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_posts_author
        FOREIGN KEY (author_id) REFERENCES users (id),
    CONSTRAINT fk_posts_group
        FOREIGN KEY (group_id) REFERENCES "groups" (id),
    CONSTRAINT chk_posts_visibility
        CHECK (visibility IN ('public', 'group')),
    CONSTRAINT chk_posts_visibility_group
        CHECK ((visibility = 'public' AND group_id IS NULL) OR (visibility = 'group' AND group_id IS NOT NULL)),
    CONSTRAINT chk_posts_status
        CHECK (status IN ('visible', 'hidden', 'deleted', 'flagged'))
);

CREATE INDEX idx_posts_group_created
    ON posts (group_id, created_at DESC);

CREATE INDEX idx_posts_author_created
    ON posts (author_id, created_at DESC);

CREATE INDEX idx_posts_status_created
    ON posts (status, created_at DESC);
