package com.thlam.streaming.livestream.controller;

import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.common.exception.ConflictException;
import com.thlam.streaming.livestream.dto.request.SrsHookRequest;
import com.thlam.streaming.livestream.dto.response.SrsHookResponse;
import com.thlam.streaming.livestream.service.IngestProperties;
import com.thlam.streaming.livestream.service.StreamService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/srs")
@RequiredArgsConstructor
public class SrsHookController {

    private static final String CALLBACK_HEADER = "X-Ingest-Callback-Secret";

    private final StreamService streamService;
    private final IngestProperties ingestProperties;

    @PostMapping("/hooks")
    public ResponseEntity<SrsHookResponse> handle(
            @RequestHeader(name = CALLBACK_HEADER, required = false) String providedSecret,
            @Valid @RequestBody SrsHookRequest request) {
        if (!matchesConfiguredSecret(providedSecret)) {
            return ResponseEntity.ok(SrsHookResponse.rejected());
        }
        try {
            switch (request.action().trim().toLowerCase(Locale.ROOT)) {
                case "on_publish" -> streamService.handleSrsPublish(request);
                case "on_unpublish" -> streamService.handleSrsUnpublish(request);
                default -> throw new InvalidRequestException("Unsupported SRS callback action");
            }
            return ResponseEntity.ok(SrsHookResponse.accepted());
        } catch (InvalidRequestException | ResourceNotFoundException | ConflictException
                | DataIntegrityViolationException exception) {
            return ResponseEntity.ok(SrsHookResponse.rejected());
        }
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
