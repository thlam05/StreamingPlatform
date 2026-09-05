package com.thlam.streaming.livestream.dto.response;

import java.util.UUID;

public record EngagementResponse(
        UUID streamId,
        String action,
        boolean active,
        long count) {
}
