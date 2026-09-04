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
@Table(name = "stream_ingest_configs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StreamIngestConfig {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "stream_id", nullable = false, updatable = false)
    private UUID streamId;

    @Column(name = "rtmp_url", nullable = false, columnDefinition = "TEXT")
    private String rtmpUrl;

    @Column(name = "stream_key_ciphertext", nullable = false, columnDefinition = "BYTEA")
    private byte[] streamKeyCiphertext;

    @Column(name = "stream_key_fingerprint", nullable = false, unique = true, length = 64)
    private String streamKeyFingerprint;

    @Column(name = "key_suffix", length = 4)
    private String keySuffix;

    @Convert(converter = IngestConfigStatusConverter.class)
    @Column(name = "status", nullable = false, length = 20)
    private IngestConfigStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "rotated_at")
    private Instant rotatedAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    public StreamIngestConfig(
            UUID id,
            UUID streamId,
            String rtmpUrl,
            byte[] streamKeyCiphertext,
            String streamKeyFingerprint,
            String keySuffix) {
        this.id = id;
        this.streamId = streamId;
        this.rtmpUrl = rtmpUrl;
        this.streamKeyCiphertext = streamKeyCiphertext;
        this.streamKeyFingerprint = streamKeyFingerprint;
        this.keySuffix = keySuffix;
        this.status = IngestConfigStatus.ACTIVE;
    }

    public void revoke(Instant revokedAt) {
        if (status == IngestConfigStatus.REVOKED) {
            return;
        }
        status = IngestConfigStatus.REVOKED;
        this.revokedAt = revokedAt;
    }

    public void rotate(Instant rotatedAt) {
        this.rotatedAt = rotatedAt;
        revoke(rotatedAt);
    }

    public void markUsed(Instant usedAt) {
        lastUsedAt = usedAt;
    }

    @PrePersist
    void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (status == null) {
            status = IngestConfigStatus.ACTIVE;
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
