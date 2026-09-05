package com.thlam.streaming.livestream.mapper;

import com.thlam.streaming.livestream.dto.response.DailyStreamStatistics;
import com.thlam.streaming.livestream.dto.response.StreamResponse;
import com.thlam.streaming.livestream.dto.response.ViewSessionResponse;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamStatsDaily;
import com.thlam.streaming.livestream.entity.StreamView;
import com.thlam.streaming.user.dto.response.UserSummary;
import org.springframework.stereotype.Component;

@Component
public class StreamMapper {

    public StreamResponse toResponse(
            Stream stream,
            UserSummary streamer,
            StreamCounts counts,
            boolean playbackAllowed) {
        return new StreamResponse(
                stream.getId(),
                streamer,
                stream.getCategoryId(),
                stream.getTitle(),
                stream.getDescription(),
                stream.getThumbnailUrl(),
                playbackAllowed ? stream.getPlaybackUrl() : null,
                stream.getStatus().getCode(),
                stream.getStartedAt(),
                stream.getEndedAt(),
                stream.getCreatedAt(),
                counts.viewerCount(),
                counts.viewCount(),
                counts.likeCount(),
                counts.following(),
                counts.liked());
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
