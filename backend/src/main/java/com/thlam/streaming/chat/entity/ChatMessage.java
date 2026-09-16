package com.thlam.streaming.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_messages")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "stream_id", nullable = false, updatable = false)
    private UUID streamId;

    @Column(name = "sender_id", nullable = false, updatable = false)
    private UUID senderId;

    @Column(name = "client_message_id", nullable = false, length = 100, updatable = false)
    private String clientMessageId;

    @Column(name = "message_text", nullable = false, columnDefinition = "TEXT")
    private String messageText;

    @Convert(converter = ChatMessageStatusConverter.class)
    @Column(nullable = false, length = 20)
    private ChatMessageStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public ChatMessage(UUID streamId, UUID senderId, String clientMessageId, String messageText) {
        this.id = UUID.randomUUID();
        this.streamId = streamId;
        this.senderId = senderId;
        this.clientMessageId = clientMessageId;
        this.messageText = messageText;
        this.status = ChatMessageStatus.PENDING;
    }

    public void applyModeration(ChatMessageStatus finalStatus) {
        this.status = finalStatus;
    }

    @PrePersist
    void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (status == null) {
            status = ChatMessageStatus.VISIBLE;
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
