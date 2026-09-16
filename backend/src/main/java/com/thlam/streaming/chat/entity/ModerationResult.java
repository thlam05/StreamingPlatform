package com.thlam.streaming.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "moderation_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ModerationResult {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "chat_message_id", nullable = false, updatable = false)
    private UUID chatMessageId;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "toxicity_score", nullable = false, precision = 5, scale = 4)
    private BigDecimal toxicityScore;

    @Column(length = 50)
    private String category;

    @Column(nullable = false, length = 20)
    private String decision;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ModerationResult(UUID chatMessageId, String modelName, BigDecimal toxicityScore,
            String category, String decision) {
        this.id = UUID.randomUUID();
        this.chatMessageId = chatMessageId;
        this.modelName = modelName;
        this.toxicityScore = toxicityScore;
        this.category = category;
        this.decision = decision;
    }

    @jakarta.persistence.PrePersist
    void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
