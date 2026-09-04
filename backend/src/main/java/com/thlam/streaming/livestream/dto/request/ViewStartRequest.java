package com.thlam.streaming.livestream.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ViewStartRequest(
        @NotBlank @Size(max = 100) String sessionId) {
}
