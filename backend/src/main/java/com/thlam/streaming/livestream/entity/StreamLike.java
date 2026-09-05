package com.thlam.streaming.livestream.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stream_likes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StreamLike {

    @EmbeddedId
    private StreamLikeId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public StreamLike(StreamLikeId id) {
        this.id = id;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
