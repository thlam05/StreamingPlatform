INSERT INTO categories (id, parent_id, name, slug, level, status)
VALUES
    ('00000000-0000-0000-0000-000000001001', NULL, 'Gaming', 'gaming', 1, 'active'),
    ('00000000-0000-0000-0000-000000001002', NULL, 'Music', 'music', 1, 'active'),
    ('00000000-0000-0000-0000-000000001003', NULL, 'Creative', 'creative', 1, 'active'),
    ('00000000-0000-0000-0000-000000001004', NULL, 'Just Chatting', 'just-chatting', 1, 'active'),
    ('00000000-0000-0000-0000-000000001005', NULL, 'Education', 'education', 1, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO categories (id, parent_id, name, slug, level, status)
SELECT child.id, parent.id, child.name, child.slug, 2, 'active'
FROM (
    VALUES
        ('00000000-0000-0000-0000-000000002001'::UUID, 'FPS', 'gaming-fps', 'gaming'),
        ('00000000-0000-0000-0000-000000002002'::UUID, 'MOBA', 'gaming-moba', 'gaming'),
        ('00000000-0000-0000-0000-000000002003'::UUID, 'Battle Royale', 'gaming-battle-royale', 'gaming'),
        ('00000000-0000-0000-0000-000000002004'::UUID, 'RPG', 'gaming-rpg', 'gaming'),
        ('00000000-0000-0000-0000-000000002005'::UUID, 'Strategy', 'gaming-strategy', 'gaming'),
        ('00000000-0000-0000-0000-000000002006'::UUID, 'Live Concerts', 'music-live-concerts', 'music'),
        ('00000000-0000-0000-0000-000000002007'::UUID, 'Music Production', 'music-production', 'music'),
        ('00000000-0000-0000-0000-000000002008'::UUID, 'DJ Sets', 'music-dj-sets', 'music'),
        ('00000000-0000-0000-0000-000000002009'::UUID, 'Singing', 'music-singing', 'music'),
        ('00000000-0000-0000-0000-000000002010'::UUID, 'Digital Art', 'creative-digital-art', 'creative'),
        ('00000000-0000-0000-0000-000000002011'::UUID, 'Coding', 'creative-coding', 'creative'),
        ('00000000-0000-0000-0000-000000002012'::UUID, 'Design', 'creative-design', 'creative'),
        ('00000000-0000-0000-0000-000000002013'::UUID, 'Writing', 'creative-writing', 'creative'),
        ('00000000-0000-0000-0000-000000002014'::UUID, 'Talk Shows', 'chatting-talk-shows', 'just-chatting'),
        ('00000000-0000-0000-0000-000000002015'::UUID, 'Q&A', 'chatting-qa', 'just-chatting'),
        ('00000000-0000-0000-0000-000000002016'::UUID, 'Podcasts', 'chatting-podcasts', 'just-chatting'),
        ('00000000-0000-0000-0000-000000002017'::UUID, 'IRL', 'chatting-irl', 'just-chatting'),
        ('00000000-0000-0000-0000-000000002018'::UUID, 'Programming', 'education-programming', 'education'),
        ('00000000-0000-0000-0000-000000002019'::UUID, 'Technology', 'education-technology', 'education'),
        ('00000000-0000-0000-0000-000000002020'::UUID, 'Languages', 'education-languages', 'education')
) AS child(id, name, slug, parent_slug)
JOIN categories parent ON parent.slug = child.parent_slug AND parent.level = 1
ON CONFLICT DO NOTHING;
