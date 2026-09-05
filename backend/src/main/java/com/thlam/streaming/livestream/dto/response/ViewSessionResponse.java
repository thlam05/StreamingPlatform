package com.thlam.streaming.livestream.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ViewSessionResponse(
        UUID streamId,
        String sessionId,
        Instant startedAt,
        Instant endedAt,
        boolean active) {
}
