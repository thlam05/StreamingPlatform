package com.thlam.streaming.livestream.entity;

import jakarta.persistence.Column;
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
@Table(name = "stream_views")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StreamView {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "stream_id", nullable = false, updatable = false)
    private UUID streamId;

    @Column(name = "viewer_id")
    private UUID viewerId;

    @Column(name = "session_id", nullable = false, length = 100, updatable = false)
    private String sessionId;

    @Column(name = "started_at", nullable = false, updatable = false)
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    public StreamView(UUID id, UUID streamId, UUID viewerId, String sessionId, Instant startedAt) {
        this.id = id;
        this.streamId = streamId;
        this.viewerId = viewerId;
        this.sessionId = sessionId;
        this.startedAt = startedAt;
    }

    public void end(Instant endedAt) {
        if (this.endedAt == null) {
            this.endedAt = endedAt;
        }
    }

    @PrePersist
    void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (startedAt == null) {
            startedAt = Instant.now();
        }
    }
}
