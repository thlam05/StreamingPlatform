CREATE TABLE comments (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    author_id UUID NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id) REFERENCES posts (id),
    CONSTRAINT fk_comments_author
        FOREIGN KEY (author_id) REFERENCES users (id),
    CONSTRAINT chk_comments_status
        CHECK (status IN ('visible', 'hidden', 'deleted', 'flagged'))
);

CREATE INDEX idx_comments_post_created
    ON comments (post_id, created_at ASC);

CREATE INDEX idx_comments_author_created
    ON comments (author_id, created_at DESC);
