package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.dto.request.CreateStreamRequest;
import com.thlam.streaming.livestream.dto.request.IngestEventRequest;
import com.thlam.streaming.livestream.dto.request.UpdateStreamRequest;
import com.thlam.streaming.livestream.dto.response.PlaybackResponse;
import com.thlam.streaming.livestream.dto.response.StreamProvisionResponse;
import com.thlam.streaming.livestream.dto.response.StreamResponse;
import java.util.List;
import java.util.UUID;

public interface StreamService {

    StreamProvisionResponse create(UUID actorId, CreateStreamRequest request);

    List<StreamResponse> findLive(UUID viewerId);

    StreamResponse get(UUID streamId, UUID viewerId);

    StreamResponse update(UUID streamId, UUID actorId, UpdateStreamRequest request);

    StreamResponse cancel(UUID streamId, UUID actorId);

    StreamResponse terminate(UUID streamId, UUID actorId);

    StreamProvisionResponse rotateCredentials(UUID streamId, UUID actorId);

    void revokeCredentials(UUID streamId, UUID actorId);

    void handleIngestEvent(IngestEventRequest request);

    PlaybackResponse getPlayback(UUID streamId, UUID viewerId);
}
