package com.thlam.streaming.user.dto.response;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        String displayName,
        String avatarUrl,
        String status,
        Instant createdAt,
        Instant updatedAt) {
}
