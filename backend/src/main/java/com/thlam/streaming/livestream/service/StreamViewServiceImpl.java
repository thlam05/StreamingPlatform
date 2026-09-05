package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.livestream.dto.request.ViewStartRequest;
import com.thlam.streaming.livestream.dto.response.ViewSessionResponse;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.entity.StreamView;
import com.thlam.streaming.livestream.mapper.StreamMapper;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.livestream.repository.StreamViewRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StreamViewServiceImpl implements StreamViewService {

    private final StreamRepository streamRepository;
    private final StreamViewRepository streamViewRepository;
    private final StreamMapper streamMapper;

    @Override
    @Transactional
    public ViewSessionResponse startView(UUID streamId, UUID viewerId, ViewStartRequest request) {
        ensureLive(streamId);
        StreamView existing = streamViewRepository.findByStreamIdAndSessionId(streamId, request.sessionId())
                .orElse(null);
        if (existing != null) {
            ensureViewOwner(existing, viewerId);
            return streamMapper.toViewResponse(existing);
        }
        StreamView view = streamViewRepository.save(new StreamView(
                UUID.randomUUID(), streamId, viewerId, request.sessionId(), Instant.now()));
        return streamMapper.toViewResponse(view);
    }

    @Override
    @Transactional
    public ViewSessionResponse heartbeat(UUID streamId, UUID viewerId, String sessionId) {
        StreamView view = findView(streamId, sessionId);
        ensureViewOwner(view, viewerId);
        return streamMapper.toViewResponse(view);
    }

    @Override
    @Transactional
    public ViewSessionResponse stopView(UUID streamId, UUID viewerId, String sessionId) {
        StreamView view = findView(streamId, sessionId);
        ensureViewOwner(view, viewerId);
        view.end(Instant.now());
        return streamMapper.toViewResponse(view);
    }

    @Override
    public long countActive(UUID streamId) {
        return streamViewRepository.countByStreamIdAndEndedAtIsNull(streamId);
    }

    @Override
    public long countTotal(UUID streamId) {
        return streamViewRepository.countByStreamId(streamId);
    }

    @Override
    @Transactional
    public void closeActiveSessions(UUID streamId, Instant endedAt) {
        streamViewRepository.closeActiveSessions(streamId, endedAt);
    }

    private Stream ensureLive(UUID streamId) {
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new ResourceNotFoundException("Stream not found"));
        if (stream.getStatus() != StreamStatus.LIVE
                || stream.getPlaybackUrl() == null || stream.getPlaybackUrl().isBlank()) {
            throw new ResourceNotFoundException("Stream is not available");
        }
        return stream;
    }

    private StreamView findView(UUID streamId, String sessionId) {
        return streamViewRepository.findByStreamIdAndSessionId(streamId, sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("View session not found"));
    }

    private void ensureViewOwner(StreamView view, UUID viewerId) {
        if (!viewerId.equals(view.getViewerId())) {
            throw new AccessDeniedException("View session belongs to another viewer");
        }
    }
}
