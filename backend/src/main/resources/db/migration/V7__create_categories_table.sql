CREATE TABLE categories (
    id UUID PRIMARY KEY,
    parent_id UUID,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    level SMALLINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_id) REFERENCES categories (id),
    CONSTRAINT chk_categories_level
        CHECK (level IN (1, 2)),
    CONSTRAINT chk_categories_parent_by_level
        CHECK ((level = 1 AND parent_id IS NULL) OR (level = 2 AND parent_id IS NOT NULL)),
    CONSTRAINT chk_categories_status
        CHECK (status IN ('active', 'inactive'))
);

CREATE UNIQUE INDEX uq_categories_top_level_name
    ON categories (name)
    WHERE parent_id IS NULL;

CREATE UNIQUE INDEX uq_categories_child_name
    ON categories (parent_id, name)
    WHERE parent_id IS NOT NULL;

CREATE INDEX idx_categories_parent_status
    ON categories (parent_id, status);
