package com.thlam.streaming.livestream.dto.response;

import java.util.UUID;
import java.util.List;

public record CategoryResponse(
        UUID id,
        UUID parentId,
        String name,
        String slug,
        Short level,
        String status,
        List<CategoryResponse> children) {
}
