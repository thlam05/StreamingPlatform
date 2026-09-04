package com.thlam.streaming.livestream.repository;

import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

public interface StreamRepository extends JpaRepository<Stream, UUID> {

    List<Stream> findAllByStatusOrderByCreatedAtDesc(StreamStatus status);

    Optional<Stream> findByIdAndStreamerId(UUID id, UUID streamerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select stream from Stream stream where stream.id = :id")
    Optional<Stream> findByIdForUpdate(@Param("id") UUID id);
}
