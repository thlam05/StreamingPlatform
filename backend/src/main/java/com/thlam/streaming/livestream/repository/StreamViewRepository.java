package com.thlam.streaming.livestream.repository;

import com.thlam.streaming.livestream.entity.StreamView;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StreamViewRepository extends JpaRepository<StreamView, UUID> {

    Optional<StreamView> findByStreamIdAndSessionId(UUID streamId, String sessionId);

    long countByStreamId(UUID streamId);

    long countByStreamIdAndEndedAtIsNull(UUID streamId);

    @Modifying
    @Query("update StreamView view set view.endedAt = :endedAt "
            + "where view.streamId = :streamId and view.endedAt is null")
    int closeActiveSessions(@Param("streamId") UUID streamId, @Param("endedAt") Instant endedAt);

    @Modifying
    @Query("update StreamView view set view.endedAt = :endedAt "
            + "where view.streamId = :streamId and view.endedAt is null "
            + "and view.startedAt < :expiredBefore")
    int closeExpiredSessions(
            @Param("streamId") UUID streamId,
            @Param("endedAt") Instant endedAt,
            @Param("expiredBefore") Instant expiredBefore);
}
