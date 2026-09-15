package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.ConflictException;
import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.livestream.dto.request.CreateStreamRequest;
import com.thlam.streaming.livestream.dto.request.SrsHookRequest;
import com.thlam.streaming.livestream.dto.request.UpdateStreamRequest;
import com.thlam.streaming.livestream.dto.response.PlaybackResponse;
import com.thlam.streaming.livestream.dto.response.StreamProvisionResponse;
import com.thlam.streaming.livestream.dto.response.StreamResponse;
import com.thlam.streaming.livestream.dto.response.StreamStartResponse;
import com.thlam.streaming.livestream.entity.IngestConfigStatus;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamIngestConfig;
import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.mapper.StreamMapper;
import com.thlam.streaming.livestream.repository.StreamIngestConfigRepository;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.storage.service.ObjectStorageService;
import com.thlam.streaming.storage.service.StorageBucket;
import com.thlam.streaming.user.dto.response.UserSummary;
import com.thlam.streaming.user.service.UserService;
import java.time.Instant;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StreamServiceImpl implements StreamService {

    private static final String STREAM_UPDATE = "PERM_stream:update";
    private static final String STREAM_DELETE = "PERM_stream:delete";
    private static final String STREAM_MODERATE = "PERM_stream:moderate";

    private final StreamRepository streamRepository;
    private final StreamIngestConfigRepository ingestConfigRepository;
    private final CategoryService categoryService;
    private final StreamCredentialService credentialService;
    private final PlaybackUrlService playbackUrlService;
    private final StreamStateMachine stateMachine;
    private final StreamMapper streamMapper;
    private final UserService userService;
    private final StreamViewService streamViewService;
    private final StreamEngagementService streamEngagementService;
    private final StreamAuthorizationService authorizationService;
    private final ObjectStorageService objectStorageService;
    private final SrsControlService srsControlService;
    private final IngestProperties ingestProperties;

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
                request.thumbnailUrl(),
                null);
        stream.setScheduledExpiresAt(Instant.now().plus(ingestProperties.getScheduledStreamTtl()));
        streamRepository.save(stream);
        StreamIngestConfig ingestConfig = new StreamIngestConfig(
                UUID.randomUUID(),
                stream.getId(),
                credentials.rtmpUrl(),
                credentials.encryptedKey(),
                credentials.fingerprint(),
                credentials.keySuffix());
        ingestConfigRepository.save(ingestConfig);
        return new StreamProvisionResponse(
                toResponse(stream, actorId),
                credentials.rtmpUrl(),
                publisherStreamKey(credentials.streamId(), credentials.plaintextKey()));
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
        Stream stream = findStream(streamId);
        if (stream.getStatus() == StreamStatus.PREVIEW
                && !stream.getStreamerId().equals(viewerId)) {
            throw new ResourceNotFoundException("Stream not found");
        }
        return toResponse(stream, viewerId);
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
    @PreAuthorize("hasAuthority('PERM_stream:update') or hasAuthority('PERM_stream:moderate')")
    @Transactional
    public StreamResponse uploadThumbnail(UUID streamId, UUID actorId, MultipartFile file) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_UPDATE, STREAM_MODERATE);
        if (stream.getStatus() != StreamStatus.SCHEDULED) {
            throw new ConflictException("Only scheduled streams can be updated");
        }

        String extension = thumbnailExtension(file);
        String objectKey = "streams/" + streamId + "/thumbnail-" + UUID.randomUUID() + "." + extension;
        String thumbnailUrl = objectStorageService.upload(StorageBucket.THUMBNAILS, objectKey, file);
        stream.updateThumbnailUrl(thumbnailUrl);
        return toResponse(stream, actorId);
    }

    private String thumbnailExtension(MultipartFile file) {
        if (file == null) {
            return "bin";
        }
        String contentType = file.getContentType();
        if (contentType == null) {
            return "bin";
        }
        return switch (contentType) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            case "image/gif" -> "gif";
            default -> "bin";
        };
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:delete') or hasAuthority('PERM_stream:moderate')")
    @Transactional
    public StreamResponse cancel(UUID streamId, UUID actorId) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_DELETE, STREAM_MODERATE);
        if (stream.getStatus() == StreamStatus.ENDED || stream.getStatus() == StreamStatus.CANCELLED) {
            return toResponse(stream, actorId);
        }
        StreamStateMachine.Transition transition = stateMachine.transition(stream.getStatus(), "cancel_stream");
        if (transition.duplicate()) {
            return toResponse(stream, actorId);
        }
        revokeActiveConfig(stream.getId(), false);
        srsControlService.kickPublisher(stream.getIngestClientId());
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
        if (stream.getStatus() == StreamStatus.ENDED || stream.getStatus() == StreamStatus.CANCELLED) {
            return toResponse(stream, actorId);
        }
        StreamStateMachine.Transition transition = stateMachine.transition(
                stream.getStatus(), "terminate_stream");
        if (transition.duplicate()) {
            return toResponse(stream, actorId);
        }
        revokeActiveConfig(stream.getId(), false);
        srsControlService.kickPublisher(stream.getIngestClientId());
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
        if (stream.getStatus() == StreamStatus.SCHEDULED || stream.getStatus() == StreamStatus.PREVIEW) {
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
            srsControlService.kickPublisher(stream.getIngestClientId());
            stream.clearPublisher();
            stream.markScheduled();
            return new StreamProvisionResponse(toResponse(stream, actorId), credentials.rtmpUrl(),
                    publisherStreamKey(credentials.streamId(), credentials.plaintextKey()));
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
        if (stream.getStatus() == StreamStatus.SCHEDULED || stream.getStatus() == StreamStatus.PREVIEW) {
            revokeActiveConfig(stream.getId(), false);
            srsControlService.kickPublisher(stream.getIngestClientId());
            Instant revokedAt = Instant.now();
            stream.markCancelled(revokedAt);
            streamViewService.closeActiveSessions(stream.getId(), revokedAt);
            return;
        }
        if (stream.getStatus() != StreamStatus.LIVE) {
            return;
        }
        revokeActiveConfig(stream.getId(), false);
        srsControlService.kickPublisher(stream.getIngestClientId());
        stream.markCancelled(Instant.now());
        streamViewService.closeActiveSessions(stream.getId(), Instant.now());
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:update') or hasAuthority('PERM_stream:moderate')")
    @Transactional
    public StreamStartResponse requestStreamStart(UUID streamId, UUID actorId) {
        Stream stream = findStreamForUpdate(streamId);
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, STREAM_UPDATE, STREAM_MODERATE);
        Instant now = Instant.now();
        if (stream.getStatus() == StreamStatus.LIVE) {
            return startResponse(stream, now);
        }
        if (stream.getStatus() == StreamStatus.ENDED || stream.getStatus() == StreamStatus.CANCELLED) {
            throw new ConflictException("Terminal streams cannot be started");
        }
        if (stream.getStatus() != StreamStatus.PREVIEW) {
            throw new ConflictException("Only preview streams can be started");
        }
        if (stream.getScheduledExpiresAt() != null && !stream.getScheduledExpiresAt().isAfter(now)) {
            expireScheduled(stream, now);
            throw new ConflictException("Stream start window has expired");
        }
        if (stream.hasStartRequest() && !stream.hasActiveStartRequest(now)) {
            stream.clearStartRequest();
        }
        if (!stream.hasActiveStartRequest(now)) {
            stream.requestStart(now, now.plus(ingestProperties.getStartRequestTtl()));
        }
        reconcileStream(stream, now);
        return startResponse(stream, now);
    }

    @Override
    @Transactional
    public void handleSrsPublish(SrsHookRequest request) {
        UUID streamId = parseStreamId(request.stream());
        Stream stream = findStreamForUpdate(streamId);
        Instant now = Instant.now();
        if (!"live".equalsIgnoreCase(request.app())) {
            throw new InvalidRequestException("Unsupported SRS application");
        }
        if (stream.getStatus() == StreamStatus.ENDED || stream.getStatus() == StreamStatus.CANCELLED) {
            throw new InvalidRequestException("Terminal streams cannot be published");
        }
        if ((stream.getStatus() == StreamStatus.SCHEDULED || stream.getStatus() == StreamStatus.PREVIEW)
                && stream.getScheduledExpiresAt() != null
                && !stream.getScheduledExpiresAt().isAfter(now)) {
            expireScheduled(stream, now);
            throw new InvalidRequestException("Stream has expired");
        }
        StreamIngestConfig config = activeConfig(stream.getId());
        String streamKey = tokenFromParam(request.param());
        if (!credentialService.matches(streamKey, config)) {
            throw new InvalidRequestException("Stream key is invalid");
        }
        if (stream.hasPublisher() && !stream.isCurrentPublisher(request.clientId())) {
            throw new InvalidRequestException("Another publisher is already active");
        }
        boolean reconnect = stream.isCurrentPublisher(request.clientId())
                && stream.getUnpublishPendingAt() != null;
        boolean duplicate = stream.isCurrentPublisher(request.clientId()) && !reconnect;
        if (!duplicate) {
            stream.observePublisher(request.clientId(), now);
        }
        config.markUsed(now);
        if (stream.hasStartRequest() && !stream.hasActiveStartRequest(now)) {
            stream.clearStartRequest();
        }
        reconcileStream(stream, now);
    }

    @Override
    @Transactional
    public void handleSrsUnpublish(SrsHookRequest request) {
        UUID streamId = parseStreamId(request.stream());
        Stream stream = findStreamForUpdate(streamId);
        if (!"live".equalsIgnoreCase(request.app())) {
            throw new InvalidRequestException("Unsupported SRS application");
        }
        if ((stream.getStatus() != StreamStatus.LIVE && stream.getStatus() != StreamStatus.PREVIEW)
                || !stream.isCurrentPublisher(request.clientId())) {
            return;
        }
        Instant now = Instant.now();
        if (stream.getStatus() == StreamStatus.PREVIEW) {
            stream.clearPublisher();
            stream.markScheduled();
        } else if (stream.getStatus() == StreamStatus.LIVE) {
            stream.markUnpublishPending(now);
        }
    }

    @Override
    @Transactional
    public void finalizeDisconnect(UUID streamId, Instant now) {
        Stream stream = findStreamForUpdate(streamId);
        if (stream.getStatus() != StreamStatus.LIVE || stream.getUnpublishPendingAt() == null
                || stream.getUnpublishPendingAt().plus(ingestProperties.getReconnectGracePeriod()).isAfter(now)) {
            return;
        }
        revokeActiveConfig(stream.getId(), false);
        stream.markEnded(now);
        streamViewService.closeActiveSessions(stream.getId(), now);
    }

    @Override
    @Transactional
    public void expireScheduledStream(UUID streamId, Instant now) {
        Stream stream = findStreamForUpdate(streamId);
        if ((stream.getStatus() != StreamStatus.SCHEDULED && stream.getStatus() != StreamStatus.PREVIEW)
                || stream.getScheduledExpiresAt() == null
                || stream.getScheduledExpiresAt().isAfter(now)) {
            return;
        }
        expireScheduled(stream, now);
    }

    @Override
    @Transactional
    public void expirePublisherConfirmation(UUID streamId, Instant now) {
        Stream stream = findStreamForUpdate(streamId);
        if (stream.getStatus() != StreamStatus.PREVIEW || stream.getPublishObservedAt() == null
                || stream.getPublishObservedAt().plus(ingestProperties.getPublisherConfirmationTimeout()).isAfter(now)) {
            return;
        }
        srsControlService.kickPublisher(stream.getIngestClientId());
        stream.clearPublisher();
        stream.markScheduled();
    }

    @Override
    @Transactional
    public void expireStartRequest(UUID streamId, Instant now) {
        Stream stream = findStreamForUpdate(streamId);
        if ((stream.getStatus() == StreamStatus.SCHEDULED || stream.getStatus() == StreamStatus.PREVIEW)
                && stream.getStartRequestExpiresAt() != null
                && !stream.getStartRequestExpiresAt().isAfter(now)) {
            stream.clearStartRequest();
        }
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:read')")
    public PlaybackResponse getPlayback(UUID streamId, UUID viewerId) {
        Stream stream = findStream(streamId);
        ensureLive(stream);
        return new PlaybackResponse(
                stream.getId(),
                stream.getPlaybackUrl(),
                playbackUrlService.variantUrl(stream.getPlaybackUrl(), PlaybackUrlService.QUALITY_720P),
                playbackUrlService.variantUrl(stream.getPlaybackUrl(), PlaybackUrlService.QUALITY_360P));
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
        return streamMapper.toResponse(stream, streamer, counts);
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

    private void reconcileStream(Stream stream, Instant now) {
        if (stream.getStatus() == StreamStatus.SCHEDULED && stream.hasActivePublisher()) {
            stream.clearStartRequest();
            stream.markPreview(credentialService.playbackUrl(stream.getId()));
            return;
        }
        if (stream.getStatus() != StreamStatus.PREVIEW
                || !stream.hasActiveStartRequest(now)
                || !stream.hasActivePublisher()) {
            return;
        }
        StreamIngestConfig config = activeConfig(stream.getId());
        config.markUsed(now);
        stream.markLive(credentialService.playbackUrl(stream.getId()), now);
    }

    private StreamStartResponse startResponse(Stream stream, Instant now) {
        return new StreamStartResponse(
                stream.getId(),
                stream.getStatus().getCode(),
                stream.getStatus() == StreamStatus.LIVE || stream.hasActiveStartRequest(now),
                stream.hasActivePublisher());
    }

    private void expireScheduled(Stream stream, Instant now) {
        srsControlService.kickPublisher(stream.getIngestClientId());
        revokeActiveConfig(stream.getId(), false);
        stream.markCancelled(now);
        streamViewService.closeActiveSessions(stream.getId(), now);
    }

    private UUID parseStreamId(String rawStreamId) {
        try {
            return UUID.fromString(rawStreamId);
        } catch (IllegalArgumentException exception) {
            throw new InvalidRequestException("SRS stream id is invalid");
        }
    }

    private String tokenFromParam(String param) {
        if (param == null || param.isBlank()) {
            throw new InvalidRequestException("SRS publish token is missing");
        }
        String query = param.startsWith("?") ? param.substring(1) : param;
        for (String pair : query.split("&")) {
            String[] parts = pair.split("=", 2);
            if (parts.length == 2 && "token".equals(parts[0])) {
                try {
                    return URLDecoder.decode(parts[1], StandardCharsets.UTF_8);
                } catch (IllegalArgumentException exception) {
                    throw new InvalidRequestException("SRS publish token is invalid");
                }
            }
        }
        throw new InvalidRequestException("SRS publish token is missing");
    }

    private String publisherStreamKey(UUID streamId, String token) {
        return streamId + "?token=" + token;
    }

    private void requireActiveCategory(UUID categoryId) {
        if (!categoryService.existsActiveLevelTwo(categoryId)) {
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
