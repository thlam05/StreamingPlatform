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

    @Column(name = "scheduled_expires_at")
    private Instant scheduledExpiresAt;

    @Column(name = "ingest_client_id", length = 128)
    private String ingestClientId;

    @Column(name = "unpublish_pending_at")
    private Instant unpublishPendingAt;

    @Column(name = "start_requested_at")
    private Instant startRequestedAt;

    @Column(name = "start_request_expires_at")
    private Instant startRequestExpiresAt;

    @Column(name = "publish_observed_at")
    private Instant publishObservedAt;

    @Column(name = "publish_session_id")
    private UUID publishSessionId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Stream(
            UUID id,
            UUID streamerId,
            UUID categoryId,
            String title,
            String description,
            String thumbnailUrl,
            String playbackUrl) {
        this.id = id;
        this.streamerId = streamerId;
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.status = StreamStatus.SCHEDULED;
        this.playbackUrl = playbackUrl;
    }

    public void setScheduledExpiresAt(Instant scheduledExpiresAt) {
        this.scheduledExpiresAt = scheduledExpiresAt;
    }

    public void requestStart(Instant requestedAt, Instant expiresAt) {
        this.startRequestedAt = requestedAt;
        this.startRequestExpiresAt = expiresAt;
    }

    public boolean hasActiveStartRequest(Instant now) {
        return startRequestedAt != null
                && startRequestExpiresAt != null
                && startRequestExpiresAt.isAfter(now);
    }

    public boolean hasStartRequest() {
        return startRequestedAt != null;
    }

    public void clearStartRequest() {
        this.startRequestedAt = null;
        this.startRequestExpiresAt = null;
    }

    public boolean hasPublisher() {
        return ingestClientId != null && publishObservedAt != null && publishSessionId != null;
    }

    public boolean hasActivePublisher() {
        return hasPublisher() && unpublishPendingAt == null;
    }

    public boolean isCurrentPublisher(String clientId) {
        return clientId != null && clientId.equals(ingestClientId) && hasPublisher();
    }

    public void observePublisher(String clientId, Instant observedAt) {
        this.ingestClientId = clientId;
        this.publishObservedAt = observedAt;
        this.publishSessionId = UUID.randomUUID();
        this.unpublishPendingAt = null;
    }

    public void markPreview() {
        this.status = StreamStatus.PREVIEW;
        this.playbackUrl = null;
    }

    public void markScheduled() {
        this.status = StreamStatus.SCHEDULED;
        this.playbackUrl = null;
    }

    public void markUnpublishPending(Instant pendingAt) {
        if (this.unpublishPendingAt == null) {
            this.unpublishPendingAt = pendingAt;
        }
    }

    public void clearPublisher() {
        this.ingestClientId = null;
        this.publishObservedAt = null;
        this.publishSessionId = null;
        this.unpublishPendingAt = null;
    }

    public void updateMetadata(UUID categoryId, String title, String description, String thumbnailUrl) {
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
    }

    public void updateThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public void markLive(String playbackUrl, Instant startedAt) {
        this.status = StreamStatus.LIVE;
        if (this.startedAt == null) {
            this.startedAt = startedAt;
        }
        this.playbackUrl = playbackUrl;
        this.unpublishPendingAt = null;
    }

    public void markEnded(Instant endedAt) {
        this.status = StreamStatus.ENDED;
        if (this.endedAt == null) {
            this.endedAt = endedAt;
        }
        this.playbackUrl = null;
        clearPublisher();
    }

    public void markCancelled(Instant endedAt) {
        this.status = StreamStatus.CANCELLED;
        if (this.endedAt == null) {
            this.endedAt = endedAt;
        }
        this.playbackUrl = null;
        clearPublisher();
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
