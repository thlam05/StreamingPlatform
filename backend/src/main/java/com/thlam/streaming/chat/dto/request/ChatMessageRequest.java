package com.thlam.streaming.chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatMessageRequest(
        @NotBlank(message = "Message is required")
        @Size(max = 500, message = "Message must contain at most 500 characters")
        String message,
        @NotBlank(message = "Client message id is required")
        @Size(max = 100, message = "Client message id must contain at most 100 characters")
        String clientMessageId) {
}
