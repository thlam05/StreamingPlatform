-- Replace the deterministic IDs introduced by V32 with database-generated UUIDs.
-- Existing stream references are remapped before the old category rows are removed.
CREATE TEMP TABLE category_id_map (
    old_id UUID PRIMARY KEY,
    new_id UUID NOT NULL UNIQUE
);

INSERT INTO category_id_map (old_id, new_id)
SELECT id, gen_random_uuid()
FROM categories
WHERE slug IN (
    'gaming', 'music', 'creative', 'just-chatting', 'education',
    'gaming-fps', 'gaming-moba', 'gaming-battle-royale', 'gaming-rpg', 'gaming-strategy',
    'music-live-concerts', 'music-production', 'music-dj-sets', 'music-singing',
    'creative-digital-art', 'creative-coding', 'creative-design', 'creative-writing',
    'chatting-talk-shows', 'chatting-qa', 'chatting-podcasts', 'chatting-irl',
    'education-programming', 'education-technology', 'education-languages'
)
AND id IN (
    '00000000-0000-0000-0000-000000001001',
    '00000000-0000-0000-0000-000000001002',
    '00000000-0000-0000-0000-000000001003',
    '00000000-0000-0000-0000-000000001004',
    '00000000-0000-0000-0000-000000001005',
    '00000000-0000-0000-0000-000000002001',
    '00000000-0000-0000-0000-000000002002',
    '00000000-0000-0000-0000-000000002003',
    '00000000-0000-0000-0000-000000002004',
    '00000000-0000-0000-0000-000000002005',
    '00000000-0000-0000-0000-000000002006',
    '00000000-0000-0000-0000-000000002007',
    '00000000-0000-0000-0000-000000002008',
    '00000000-0000-0000-0000-000000002009',
    '00000000-0000-0000-0000-000000002010',
    '00000000-0000-0000-0000-000000002011',
    '00000000-0000-0000-0000-000000002012',
    '00000000-0000-0000-0000-000000002013',
    '00000000-0000-0000-0000-000000002014',
    '00000000-0000-0000-0000-000000002015',
    '00000000-0000-0000-0000-000000002016',
    '00000000-0000-0000-0000-000000002017',
    '00000000-0000-0000-0000-000000002018',
    '00000000-0000-0000-0000-000000002019',
    '00000000-0000-0000-0000-000000002020'
);

CREATE TEMP TABLE category_seed_data ON COMMIT DROP AS
SELECT category.*
FROM categories category
JOIN category_id_map mapping ON mapping.old_id = category.id;

UPDATE streams stream
SET category_id = mapping.new_id
FROM category_id_map mapping
WHERE stream.category_id = mapping.old_id;

DELETE FROM categories category
USING category_id_map mapping
WHERE category.id = mapping.old_id
  AND category.level = 2;

DELETE FROM categories category
USING category_id_map mapping
WHERE category.id = mapping.old_id
  AND category.level = 1;

INSERT INTO categories (id, parent_id, name, slug, level, status, created_at, updated_at)
SELECT mapping.new_id,
       NULL,
       seed.name,
       seed.slug,
       seed.level,
       seed.status,
       seed.created_at,
       seed.updated_at
FROM category_seed_data seed
JOIN category_id_map mapping ON mapping.old_id = seed.id
WHERE seed.level = 1;

INSERT INTO categories (id, parent_id, name, slug, level, status, created_at, updated_at)
SELECT child_mapping.new_id,
       parent_mapping.new_id,
       seed.name,
       seed.slug,
       seed.level,
       seed.status,
       seed.created_at,
       seed.updated_at
FROM category_seed_data seed
JOIN category_id_map child_mapping ON child_mapping.old_id = seed.id
JOIN category_id_map parent_mapping ON parent_mapping.old_id = seed.parent_id
WHERE seed.level = 2;
