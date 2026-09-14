package com.thlam.streaming.livestream.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public record StreamStartResponse(
        @JsonProperty("stream_id") UUID streamId,
        String status,
        boolean startRequested,
        boolean publisherObserved) {
}
