package com.thlam.streaming.livestream.repository;

import com.thlam.streaming.livestream.entity.IngestConfigStatus;
import com.thlam.streaming.livestream.entity.StreamIngestConfig;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreamIngestConfigRepository extends JpaRepository<StreamIngestConfig, UUID> {

    Optional<StreamIngestConfig> findByStreamIdAndStatus(UUID streamId, IngestConfigStatus status);

    Optional<StreamIngestConfig> findByStreamKeyFingerprintAndStatus(
            String streamKeyFingerprint, IngestConfigStatus status);
}
