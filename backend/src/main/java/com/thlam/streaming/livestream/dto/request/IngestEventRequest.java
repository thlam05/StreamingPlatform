package com.thlam.streaming.livestream.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record IngestEventRequest(
        @NotNull UUID streamId,
        @NotBlank String event,
        String streamKey,
        String playbackUrl) {
}
