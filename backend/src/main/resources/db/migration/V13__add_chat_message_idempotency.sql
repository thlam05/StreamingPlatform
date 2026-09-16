ALTER TABLE chat_messages
    ADD COLUMN client_message_id VARCHAR(100);

UPDATE chat_messages
SET client_message_id = id::text
WHERE client_message_id IS NULL;

ALTER TABLE chat_messages
    ALTER COLUMN client_message_id SET NOT NULL;

ALTER TABLE chat_messages
    ADD CONSTRAINT uq_chat_messages_client_id
        UNIQUE (stream_id, sender_id, client_message_id);
