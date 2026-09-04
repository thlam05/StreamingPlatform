package com.thlam.streaming.livestream.repository;

import com.thlam.streaming.livestream.entity.StreamLike;
import com.thlam.streaming.livestream.entity.StreamLikeId;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreamLikeRepository extends JpaRepository<StreamLike, StreamLikeId> {

    long countByIdStreamId(UUID streamId);
}
