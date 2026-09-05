package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.dto.request.ViewStartRequest;
import com.thlam.streaming.livestream.dto.response.ViewSessionResponse;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

public interface StreamViewService {

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    ViewSessionResponse startView(UUID streamId, UUID viewerId, ViewStartRequest request);

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    ViewSessionResponse heartbeat(UUID streamId, UUID viewerId, String sessionId);

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    ViewSessionResponse stopView(UUID streamId, UUID viewerId, String sessionId);

    long countActive(UUID streamId);

    long countTotal(UUID streamId);

    void closeActiveSessions(UUID streamId, Instant endedAt);
}
