package com.thlam.streaming.livestream.repository;

import com.thlam.streaming.livestream.entity.Follow;
import com.thlam.streaming.livestream.entity.FollowId;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {

    @Query("select count(follow) from Follow follow where follow.id.streamerId = :streamerId")
    long countByStreamerId(@Param("streamerId") UUID streamerId);
}
