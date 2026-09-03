CREATE TABLE "groups" (
    id UUID PRIMARY KEY,
    owner_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    visibility VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_groups_owner
        FOREIGN KEY (owner_id) REFERENCES users (id),
    CONSTRAINT chk_groups_visibility
        CHECK (visibility IN ('public', 'private'))
);

CREATE INDEX idx_groups_visibility_created
    ON "groups" (visibility, created_at DESC);
