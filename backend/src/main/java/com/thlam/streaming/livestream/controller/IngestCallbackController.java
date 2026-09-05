package com.thlam.streaming.livestream.controller;

import com.thlam.streaming.common.exception.UnauthorizedException;
import com.thlam.streaming.livestream.dto.request.IngestEventRequest;
import com.thlam.streaming.livestream.service.IngestProperties;
import com.thlam.streaming.livestream.service.StreamService;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/streams")
@RequiredArgsConstructor
public class IngestCallbackController {

    private static final String CALLBACK_HEADER = "X-Ingest-Callback-Secret";

    private final StreamService streamService;
    private final IngestProperties ingestProperties;

    @PostMapping("/ingest-events")
    public ResponseEntity<Void> handle(
            @RequestHeader(name = CALLBACK_HEADER, required = false) String providedSecret,
            @Valid @RequestBody IngestEventRequest request) {
        if (!matchesConfiguredSecret(providedSecret)) {
            throw new UnauthorizedException("Invalid ingest callback credentials");
        }
        streamService.handleIngestEvent(request);
        return ResponseEntity.accepted().build();
    }

    private boolean matchesConfiguredSecret(String providedSecret) {
        String configuredSecret = ingestProperties.getCallbackSecret();
        if (providedSecret == null || configuredSecret == null || configuredSecret.isBlank()) {
            return false;
        }
        return MessageDigest.isEqual(
                providedSecret.getBytes(StandardCharsets.UTF_8),
                configuredSecret.getBytes(StandardCharsets.UTF_8));
    }
}
