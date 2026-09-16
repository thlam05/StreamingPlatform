package com.thlam.streaming.livestream.mapper;

import com.thlam.streaming.livestream.dto.response.DailyStreamStatistics;
import com.thlam.streaming.livestream.dto.response.StreamResponse;
import com.thlam.streaming.livestream.dto.response.ViewSessionResponse;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamStatsDaily;
import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.entity.StreamView;
import com.thlam.streaming.livestream.service.PlaybackUrlService;
import com.thlam.streaming.user.dto.response.UserSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StreamMapper {

    private final PlaybackUrlService playbackUrlService;

    public StreamResponse toResponse(
            Stream stream,
            UserSummary streamer,
            StreamCounts counts,
            String categoryName,
            boolean includeOwnerLifecycleDetails) {
        return new StreamResponse(
                stream.getId(),
                streamer,
                stream.getCategoryId(),
                categoryName,
                stream.getTitle(),
                stream.getDescription(),
                stream.getThumbnailUrl(),
                stream.getPlaybackUrl(),
                playbackUrlService.variantUrl(stream.getPlaybackUrl(), PlaybackUrlService.QUALITY_720P),
                playbackUrlService.variantUrl(stream.getPlaybackUrl(), PlaybackUrlService.QUALITY_360P),
                stream.getStatus().getCode(),
                stream.getStartedAt(),
                stream.getEndedAt(),
                stream.getCreatedAt(),
                counts.viewerCount(),
                counts.viewCount(),
                counts.likeCount(),
                counts.following(),
                counts.liked(),
                includeOwnerLifecycleDetails
                        && (stream.hasActiveStartRequest(java.time.Instant.now()) || stream.getStatus() == StreamStatus.LIVE),
                includeOwnerLifecycleDetails && stream.hasActivePublisher());
    }

    public ViewSessionResponse toViewResponse(StreamView view) {
        return new ViewSessionResponse(
                view.getStreamId(),
                view.getSessionId(),
                view.getStartedAt(),
                view.getEndedAt(),
                view.getEndedAt() == null);
    }

    public DailyStreamStatistics toDailyStatistics(StreamStatsDaily stats) {
        return new DailyStreamStatistics(
                stats.getId().getStatDate(),
                stats.getViewCount(),
                stats.getUniqueViewerCount(),
                stats.getLikeCount(),
                stats.getChatMessageCount(),
                stats.getGiftCount());
    }

    public record StreamCounts(
            long viewerCount,
            long viewCount,
            long likeCount,
            boolean following,
            boolean liked) {
    }
}
