package com.thlam.streaming.livestream.dto.response;

import com.thlam.streaming.user.dto.response.UserSummary;
import java.time.Instant;
import java.util.UUID;

public record StreamResponse(
        UUID id,
        UserSummary streamer,
        UUID categoryId,
        String categoryName,
        String title,
        String description,
        String thumbnailUrl,
        String playbackUrl,
        String playbackUrl720p,
        String playbackUrl360p,
        String status,
        Instant startedAt,
        Instant endedAt,
        Instant createdAt,
        long viewerCount,
        long viewCount,
        long likeCount,
        boolean following,
        boolean liked,
        boolean startRequested,
        boolean publisherObserved) {
}
