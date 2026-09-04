package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.ConflictException;
import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.livestream.dto.request.CreateStreamRequest;
import com.thlam.streaming.livestream.dto.request.IngestEventRequest;
import com.thlam.streaming.livestream.dto.request.UpdateStreamRequest;
import com.thlam.streaming.livestream.dto.response.PlaybackResponse;
import com.thlam.streaming.livestream.dto.response.StreamProvisionResponse;
import com.thlam.streaming.livestream.dto.response.StreamResponse;
import com.thlam.streaming.livestream.entity.IngestConfigStatus;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamIngestConfig;
import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.mapper.StreamMapper;
import com.thlam.streaming.livestream.repository.CategoryLookupRepository;
import com.thlam.streaming.livestream.repository.StreamIngestConfigRepository;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.user.dto.response.UserSummary;
import com.thlam.streaming.user.service.UserService;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StreamServiceImpl implements StreamService {

    private static final String STREAM_UPDATE = "PERM_stream:update";
    private static final String STREAM_DELETE = "PERM_stream:delete";
    private static final String STREAM_MODERATE = "PERM_stream:moderate";

    private final StreamRepository streamRepository;
    private final StreamIngestConfigRepository ingestConfigRepository;
    private final CategoryLookupRepository categoryLookupRepository;
    private final StreamCredentialService credentialService;
    private final StreamStateMachine stateMachine;
    private final StreamMapper streamMapper;
    private final UserService userService;
    private final StreamViewService streamViewService;
    private final StreamEngagementService streamEngagementService;
    private final StreamAuthorizationService authorizationService;

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:create')")
    @Transactional
    public StreamProvisionResponse create(UUID actorId, CreateStreamRequest request) {
        requireActiveCategory(request.categoryId());
        StreamCredentialService.GeneratedCredentials credentials = credentialService.generate(UUID.randomUUID());
        Stream stream = new Stream(
                credentials.streamId(),
                actorId,
                request.categoryId(),
                request.title(),
                request.description(),
                request.thumbnailUrl());
        streamRepository.save(stream);
        ingestConfigRepository.save(new StreamIngestConfig(
                UUID.randomUUID(),
                stream.getId(),
                credentials.rtmpUrl(),
                credentials.encryptedKey(),
                credentials.fingerprint(),
                credentials.keySuffix()));
        return new StreamProvisionResponse(
                toResponse(stream, actorId),
                credentials.rtmpUrl(),
                credentials.plaintextKey());
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:read')")
    public List<StreamResponse> findLive(UUID viewerId) {
        List<Stream> streams = streamRepository.findAllByStatusOrderByCreatedAtDesc(StreamStatus.LIVE);
        Map<UUID, UserSummary> profiles = profilesFor(streams);
        return streams.stream().map(stream -> toResponse(stream, viewerId, profiles)).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:read')")
    public StreamResponse get(UUID streamId, UUID viewerId) {
        return toResponse(findStream(streamId), viewerId);
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:update')")
    @Transactional
    public StreamResponse update(UUID streamId, UUID actorId, UpdateStreamRequest request) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_UPDATE);
        if (stream.getStatus() != StreamStatus.SCHEDULED) {
            throw new ConflictException("Only scheduled streams can be updated");
        }
        requireActiveCategory(request.categoryId());
        stream.updateMetadata(
                request.categoryId(),
                request.title(),
                request.description(),
                request.thumbnailUrl());
        return toResponse(stream, actorId);
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:delete') or hasAuthority('PERM_stream:moderate')")
    @Transactional
    public StreamResponse cancel(UUID streamId, UUID actorId) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_DELETE, STREAM_MODERATE);
        StreamStateMachine.Transition transition = stateMachine.transition(stream.getStatus(), "cancel_stream");
        if (transition.duplicate()) {
            return toResponse(stream, actorId);
        }
        revokeActiveConfig(stream.getId(), false);
        stream.markCancelled(Instant.now());
        streamViewService.closeActiveSessions(stream.getId(), Instant.now());
        return toResponse(stream, actorId);
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:moderate')")
    @Transactional
    public StreamResponse terminate(UUID streamId, UUID actorId) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_MODERATE);
        StreamStateMachine.Transition transition = stateMachine.transition(
                stream.getStatus(), "terminate_stream");
        if (transition.duplicate()) {
            return toResponse(stream, actorId);
        }
        revokeActiveConfig(stream.getId(), false);
        Instant endedAt = Instant.now();
        stream.markCancelled(endedAt);
        streamViewService.closeActiveSessions(stream.getId(), endedAt);
        return toResponse(stream, actorId);
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:update') or hasAuthority('PERM_stream:moderate')")
    @Transactional
    public StreamProvisionResponse rotateCredentials(UUID streamId, UUID actorId) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_UPDATE, STREAM_MODERATE);
        if (stream.getStatus() == StreamStatus.SCHEDULED) {
            StreamIngestConfig active = activeConfig(stream.getId());
            active.rotate(Instant.now());
            StreamCredentialService.GeneratedCredentials credentials = credentialService.generate(stream.getId());
            ingestConfigRepository.save(new StreamIngestConfig(
                    UUID.randomUUID(),
                    stream.getId(),
                    credentials.rtmpUrl(),
                    credentials.encryptedKey(),
                    credentials.fingerprint(),
                    credentials.keySuffix()));
            return new StreamProvisionResponse(toResponse(stream, actorId), credentials.rtmpUrl(),
                    credentials.plaintextKey());
        }
        if (stream.getStatus() != StreamStatus.LIVE) {
            throw new ConflictException("Terminal streams cannot rotate credentials");
        }
        revokeActiveConfig(stream.getId(), true);
        stream.markEnded(Instant.now());
        streamViewService.closeActiveSessions(stream.getId(), Instant.now());
        return new StreamProvisionResponse(toResponse(stream, actorId), null, null);
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:update') or hasAuthority('PERM_stream:moderate')")
    @Transactional
    public void revokeCredentials(UUID streamId, UUID actorId) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_UPDATE, STREAM_MODERATE);
        if (stream.getStatus() == StreamStatus.SCHEDULED) {
            revokeActiveConfig(stream.getId(), false);
            stream.markCancelled(Instant.now());
            return;
        }
        if (stream.getStatus() != StreamStatus.LIVE) {
            return;
        }
        revokeActiveConfig(stream.getId(), false);
        stream.markCancelled(Instant.now());
        streamViewService.closeActiveSessions(stream.getId(), Instant.now());
    }

    @Override
    @Transactional
    public void handleIngestEvent(IngestEventRequest request) {
        Stream stream = findStreamForUpdate(request.streamId());
        StreamStateMachine.Transition transition = stateMachine.transition(stream.getStatus(), request.event());
        if (transition.duplicate()) {
            return;
        }
        if (transition.nextStatus() == StreamStatus.LIVE) {
            StreamIngestConfig config = activeConfig(stream.getId());
            if (!credentialService.matches(request.streamKey(), config)) {
                throw new InvalidRequestException("Stream key is invalid");
            }
            if (request.playbackUrl() == null || request.playbackUrl().isBlank()) {
                throw new InvalidRequestException("Playback URL is required before a stream goes live");
            }
            config.markUsed(Instant.now());
            stream.markLive(request.playbackUrl(), Instant.now());
            return;
        }
        revokeActiveConfig(stream.getId(), false);
        Instant endedAt = Instant.now();
        if (transition.nextStatus() == StreamStatus.ENDED) {
            stream.markEnded(endedAt);
        } else {
            stream.markCancelled(endedAt);
        }
        streamViewService.closeActiveSessions(stream.getId(), endedAt);
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:read')")
    public PlaybackResponse getPlayback(UUID streamId, UUID viewerId) {
        Stream stream = findStream(streamId);
        ensureLive(stream);
        return new PlaybackResponse(stream.getId(), stream.getPlaybackUrl());
    }

    private StreamResponse toResponse(Stream stream, UUID viewerId) {
        return toResponse(stream, viewerId, profilesFor(List.of(stream)));
    }

    private StreamResponse toResponse(Stream stream, UUID viewerId, Map<UUID, UserSummary> profiles) {
        UserSummary streamer = profiles.get(stream.getStreamerId());
        if (streamer == null) {
            throw new ResourceNotFoundException("Streamer not found");
        }
        StreamMapper.StreamCounts counts = new StreamMapper.StreamCounts(
                streamViewService.countActive(stream.getId()),
                streamViewService.countTotal(stream.getId()),
                streamEngagementService.countLikes(stream.getId()),
                viewerId != null && streamEngagementService.isFollowing(viewerId, stream.getStreamerId()),
                viewerId != null && streamEngagementService.isLiked(viewerId, stream.getId()));
        return streamMapper.toResponse(stream, streamer, counts, stream.getStatus() == StreamStatus.LIVE);
    }

    private Map<UUID, UserSummary> profilesFor(List<Stream> streams) {
        return userService.getPublicProfiles(
                streams.stream().map(Stream::getStreamerId).collect(java.util.stream.Collectors.toSet()));
    }

    private Stream findStream(UUID streamId) {
        return streamRepository.findById(streamId)
                .orElseThrow(() -> new ResourceNotFoundException("Stream not found"));
    }

    private Stream findStreamForUpdate(UUID streamId) {
        return streamRepository.findByIdForUpdate(streamId)
                .orElseThrow(() -> new ResourceNotFoundException("Stream not found"));
    }

    private StreamIngestConfig activeConfig(UUID streamId) {
        return ingestConfigRepository.findByStreamIdAndStatus(streamId, IngestConfigStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Stream ingest configuration not found"));
    }

    private void revokeActiveConfig(UUID streamId, boolean rotated) {
        ingestConfigRepository.findByStreamIdAndStatus(streamId, IngestConfigStatus.ACTIVE)
                .ifPresent(config -> {
                    if (rotated) {
                        config.rotate(Instant.now());
                    } else {
                        config.revoke(Instant.now());
                    }
                });
    }

    private void requireActiveCategory(UUID categoryId) {
        if (!categoryLookupRepository.existsActiveLevelTwo(categoryId)) {
            throw new ResourceNotFoundException("Active level 2 category not found");
        }
    }

    private void ensureLive(Stream stream) {
        if (stream.getStatus() != StreamStatus.LIVE) {
            throw new ResourceNotFoundException("Stream is not available");
        }
        if (stream.getPlaybackUrl() == null || stream.getPlaybackUrl().isBlank()) {
            throw new ResourceNotFoundException("Playback is unavailable");
        }
    }

}
