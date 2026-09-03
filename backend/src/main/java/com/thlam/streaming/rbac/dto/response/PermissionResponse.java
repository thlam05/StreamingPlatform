package com.thlam.streaming.rbac.dto.response;

import java.time.Instant;
import java.util.UUID;

public record PermissionResponse(
        UUID id,
        String code,
        String name,
        String description,
        String resource,
        String action,
        Instant createdAt) {
}
