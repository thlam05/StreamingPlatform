package com.thlam.streaming.chat.dto.response;

import com.thlam.streaming.user.dto.response.UserSummary;
import java.time.Instant;
import java.util.UUID;

public record ChatMessageResponse(
        UUID id,
        UUID streamId,
        UserSummary sender,
        String message,
        String status,
        Instant createdAt) {
}
