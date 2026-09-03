package com.thlam.streaming.auth.dto.response;

import com.thlam.streaming.auth.entity.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String username,
        UserRole role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
