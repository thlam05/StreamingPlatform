package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.dto.request.CreateStreamRequest;
import com.thlam.streaming.livestream.dto.request.SrsHookRequest;
import com.thlam.streaming.livestream.dto.request.UpdateStreamRequest;
import com.thlam.streaming.livestream.dto.response.PlaybackResponse;
import com.thlam.streaming.livestream.dto.response.StreamProvisionResponse;
import com.thlam.streaming.livestream.dto.response.StreamResponse;
import com.thlam.streaming.livestream.dto.response.StreamStartResponse;
import java.util.List;
import java.util.UUID;
import java.time.Instant;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

public interface StreamService {

    StreamProvisionResponse create(UUID actorId, CreateStreamRequest request);

    @PreAuthorize("permitAll()")
    List<StreamResponse> findLive(UUID viewerId);

    List<StreamResponse> findOwned(UUID ownerId);

    @PreAuthorize("permitAll()")
    StreamResponse get(UUID streamId, UUID viewerId);

    StreamResponse end(UUID streamId, UUID actorId);

    StreamResponse update(UUID streamId, UUID actorId, UpdateStreamRequest request);

    StreamResponse uploadThumbnail(UUID streamId, UUID actorId, MultipartFile file);

    StreamResponse cancel(UUID streamId, UUID actorId);

    StreamResponse terminate(UUID streamId, UUID actorId);

    StreamProvisionResponse rotateCredentials(UUID streamId, UUID actorId);

    void revokeCredentials(UUID streamId, UUID actorId);

    StreamStartResponse requestStreamStart(UUID streamId, UUID actorId);

    void handleSrsPublish(SrsHookRequest request);

    void handleSrsUnpublish(SrsHookRequest request);

    void finalizeDisconnect(UUID streamId, Instant now);

    void expireScheduledStream(UUID streamId, Instant now);

    void expirePublisherConfirmation(UUID streamId, Instant now);

    void expireStartRequest(UUID streamId, Instant now);

    @PreAuthorize("permitAll()")
    PlaybackResponse getPlayback(UUID streamId, UUID viewerId);
}
