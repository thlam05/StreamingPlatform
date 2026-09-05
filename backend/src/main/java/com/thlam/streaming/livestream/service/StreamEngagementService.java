package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.dto.response.EngagementResponse;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

public interface StreamEngagementService {

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    EngagementResponse follow(UUID streamerId, UUID viewerId);

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    EngagementResponse unfollow(UUID streamerId, UUID viewerId);

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    EngagementResponse like(UUID streamId, UUID viewerId);

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    EngagementResponse unlike(UUID streamId, UUID viewerId);

    long countFollows(UUID streamerId);

    long countLikes(UUID streamId);

    boolean isFollowing(UUID viewerId, UUID streamerId);

    boolean isLiked(UUID viewerId, UUID streamId);
}
