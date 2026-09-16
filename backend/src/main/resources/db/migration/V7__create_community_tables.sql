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
    CONSTRAINT chk_groups_visibility CHECK (visibility IN ('public', 'private'))
);

CREATE INDEX idx_groups_visibility_created
    ON "groups" (visibility, created_at DESC);

CREATE TABLE group_memberships (
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    joined_at TIMESTAMPTZ,

    CONSTRAINT pk_group_memberships PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_group_memberships_group
        FOREIGN KEY (group_id) REFERENCES "groups" (id),
    CONSTRAINT fk_group_memberships_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT chk_group_memberships_role
        CHECK (role IN ('member', 'moderator', 'owner')),
    CONSTRAINT chk_group_memberships_status
        CHECK (status IN ('pending', 'active', 'blocked', 'left'))
);

CREATE INDEX idx_group_memberships_user_status
    ON group_memberships (user_id, status, joined_at DESC);

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
    CONSTRAINT chk_posts_visibility CHECK (visibility IN ('public', 'group')),
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

CREATE TABLE post_likes (
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_post_likes PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_post_likes_post
        FOREIGN KEY (post_id) REFERENCES posts (id),
    CONSTRAINT fk_post_likes_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_post_likes_user
    ON post_likes (user_id, created_at DESC);

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

CREATE TABLE group_messages (
    id UUID PRIMARY KEY,
    group_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    message_text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_group_messages_group
        FOREIGN KEY (group_id) REFERENCES "groups" (id),
    CONSTRAINT fk_group_messages_sender
        FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT chk_group_messages_status
        CHECK (status IN ('visible', 'hidden', 'deleted', 'flagged'))
);

CREATE INDEX idx_group_messages_group_created
    ON group_messages (group_id, created_at DESC);

CREATE INDEX idx_group_messages_sender
    ON group_messages (sender_id, created_at DESC);
