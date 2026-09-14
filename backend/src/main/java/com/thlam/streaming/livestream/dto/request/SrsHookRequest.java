package com.thlam.streaming.livestream.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record SrsHookRequest(
        @NotBlank String action,
        @NotBlank String app,
        @NotBlank String stream,
        String param,
        @NotBlank @JsonProperty("client_id") String clientId,
        String ip) {
}
