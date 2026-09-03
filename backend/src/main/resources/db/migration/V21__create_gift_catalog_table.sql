CREATE TABLE gift_catalog (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT,
    price NUMERIC(12, 2),
    currency VARCHAR(10),
    status VARCHAR(20) NOT NULL,
    CONSTRAINT chk_gift_catalog_price
        CHECK (price IS NULL OR price >= 0),
    CONSTRAINT chk_gift_catalog_status
        CHECK (status IN ('active', 'inactive'))
);

CREATE INDEX idx_gift_catalog_status
    ON gift_catalog (status, name);
