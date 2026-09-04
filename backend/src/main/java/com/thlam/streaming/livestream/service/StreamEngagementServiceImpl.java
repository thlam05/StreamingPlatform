package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.ConflictException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.livestream.dto.response.EngagementResponse;
import com.thlam.streaming.livestream.entity.Follow;
import com.thlam.streaming.livestream.entity.FollowId;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamLike;
import com.thlam.streaming.livestream.entity.StreamLikeId;
import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.repository.FollowRepository;
import com.thlam.streaming.livestream.repository.StreamLikeRepository;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.user.service.UserService;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StreamEngagementServiceImpl implements StreamEngagementService {

    private final StreamRepository streamRepository;
    private final FollowRepository followRepository;
    private final StreamLikeRepository likeRepository;
    private final UserService userService;

    @Override
    @Transactional
    public EngagementResponse follow(UUID streamerId, UUID viewerId) {
        ensureActiveUser(streamerId);
        if (streamerId.equals(viewerId)) {
            throw new ConflictException("A user cannot follow themselves");
        }
        FollowId id = new FollowId(viewerId, streamerId);
        if (!followRepository.existsById(id)) {
            followRepository.save(new Follow(id));
        }
        return new EngagementResponse(streamerId, "follow", true, countFollows(streamerId));
    }

    @Override
    @Transactional
    public EngagementResponse unfollow(UUID streamerId, UUID viewerId) {
        ensureActiveUser(streamerId);
        followRepository.deleteById(new FollowId(viewerId, streamerId));
        return new EngagementResponse(streamerId, "unfollow", false, countFollows(streamerId));
    }

    @Override
    @Transactional
    public EngagementResponse like(UUID streamId, UUID viewerId) {
        ensureLive(streamId);
        StreamLikeId id = new StreamLikeId(viewerId, streamId);
        if (!likeRepository.existsById(id)) {
            likeRepository.save(new StreamLike(id));
        }
        return new EngagementResponse(streamId, "like", true, countLikes(streamId));
    }

    @Override
    @Transactional
    public EngagementResponse unlike(UUID streamId, UUID viewerId) {
        ensureLive(streamId);
        likeRepository.deleteById(new StreamLikeId(viewerId, streamId));
        return new EngagementResponse(streamId, "unlike", false, countLikes(streamId));
    }

    @Override
    public long countFollows(UUID streamerId) {
        return followRepository.countByStreamerId(streamerId);
    }

    @Override
    public long countLikes(UUID streamId) {
        return likeRepository.countByIdStreamId(streamId);
    }

    @Override
    public boolean isFollowing(UUID viewerId, UUID streamerId) {
        return followRepository.existsById(new FollowId(viewerId, streamerId));
    }

    @Override
    public boolean isLiked(UUID viewerId, UUID streamId) {
        return likeRepository.existsById(new StreamLikeId(viewerId, streamId));
    }

    private void ensureActiveUser(UUID userId) {
        Set<UUID> userIds = Set.of(userId);
        if (userService.getPublicProfiles(userIds).isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }
    }

    private void ensureLive(UUID streamId) {
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new ResourceNotFoundException("Stream not found"));
        if (stream.getStatus() != StreamStatus.LIVE
                || stream.getPlaybackUrl() == null || stream.getPlaybackUrl().isBlank()) {
            throw new ResourceNotFoundException("Stream is not available");
        }
    }
}
