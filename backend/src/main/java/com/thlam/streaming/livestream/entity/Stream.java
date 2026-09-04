package com.thlam.streaming.livestream.entity;

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
@Table(name = "streams")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Stream {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "streamer_id", nullable = false, updatable = false)
    private UUID streamerId;

    @Column(name = "category_id", nullable = false)
    private UUID categoryId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "playback_url", columnDefinition = "TEXT")
    private String playbackUrl;

    @Convert(converter = StreamStatusConverter.class)
    @Column(name = "status", nullable = false, length = 20)
    private StreamStatus status;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Stream(
            UUID id,
            UUID streamerId,
            UUID categoryId,
            String title,
            String description,
            String thumbnailUrl) {
        this.id = id;
        this.streamerId = streamerId;
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.status = StreamStatus.SCHEDULED;
    }

    public void updateMetadata(UUID categoryId, String title, String description, String thumbnailUrl) {
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
    }

    public void markLive(String playbackUrl, Instant startedAt) {
        this.status = StreamStatus.LIVE;
        if (this.startedAt == null) {
            this.startedAt = startedAt;
        }
        this.playbackUrl = playbackUrl;
    }

    public void markEnded(Instant endedAt) {
        this.status = StreamStatus.ENDED;
        if (this.endedAt == null) {
            this.endedAt = endedAt;
        }
        this.playbackUrl = null;
    }

    public void markCancelled(Instant endedAt) {
        this.status = StreamStatus.CANCELLED;
        if (this.endedAt == null) {
            this.endedAt = endedAt;
        }
        this.playbackUrl = null;
    }

    public void setPlaybackUrl(String playbackUrl) {
        this.playbackUrl = playbackUrl;
    }

    @PrePersist
    void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (status == null) {
            status = StreamStatus.SCHEDULED;
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
