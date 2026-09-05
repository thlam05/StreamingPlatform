package com.thlam.streaming.livestream.controller;

import com.thlam.streaming.common.dtos.ApiResponse;
import com.thlam.streaming.common.enums.ApiResponseCode;
import com.thlam.streaming.common.security.CurrentUserProvider;
import com.thlam.streaming.livestream.dto.request.CreateStreamRequest;
import com.thlam.streaming.livestream.dto.request.UpdateStreamRequest;
import com.thlam.streaming.livestream.dto.request.ViewStartRequest;
import com.thlam.streaming.livestream.dto.response.EngagementResponse;
import com.thlam.streaming.livestream.dto.response.PlaybackResponse;
import com.thlam.streaming.livestream.dto.response.StreamProvisionResponse;
import com.thlam.streaming.livestream.dto.response.StreamResponse;
import com.thlam.streaming.livestream.dto.response.StreamStatisticsResponse;
import com.thlam.streaming.livestream.dto.response.ViewSessionResponse;
import com.thlam.streaming.livestream.service.StreamEngagementService;
import com.thlam.streaming.livestream.service.StreamService;
import com.thlam.streaming.livestream.service.StreamStatisticsService;
import com.thlam.streaming.livestream.service.StreamViewService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/streams")
@RequiredArgsConstructor
public class StreamController {

    private final StreamService streamService;
    private final StreamViewService streamViewService;
    private final StreamEngagementService streamEngagementService;
    private final StreamStatisticsService streamStatisticsService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<StreamProvisionResponse>> create(
            @Valid @RequestBody CreateStreamRequest request) {
        StreamProvisionResponse response = streamService.create(currentUserProvider.getRequiredUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(response, ApiResponseCode.STREAM_CREATED.getCode(),
                        "Stream created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StreamResponse>>> findLive() {
        List<StreamResponse> response = streamService.findLive(currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAMS_RETRIEVED.getCode(),
                "Live streams retrieved successfully"));
    }

    @GetMapping("/{streamId}")
    public ResponseEntity<ApiResponse<StreamResponse>> get(@PathVariable UUID streamId) {
        StreamResponse response = streamService.get(streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_RETRIEVED.getCode(),
                "Stream retrieved successfully"));
    }

    @PutMapping("/{streamId}")
    public ResponseEntity<ApiResponse<StreamResponse>> update(
            @PathVariable UUID streamId,
            @Valid @RequestBody UpdateStreamRequest request) {
        StreamResponse response = streamService.update(
                streamId, currentUserProvider.getRequiredUserId(), request);
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_UPDATED.getCode(),
                "Stream updated successfully"));
    }

    @PostMapping("/{streamId}/cancel")
    public ResponseEntity<ApiResponse<StreamResponse>> cancel(@PathVariable UUID streamId) {
        StreamResponse response = streamService.cancel(streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_CANCELLED.getCode(),
                "Stream cancelled successfully"));
    }

    @PostMapping("/{streamId}/terminate")
    public ResponseEntity<ApiResponse<StreamResponse>> terminate(@PathVariable UUID streamId) {
        StreamResponse response = streamService.terminate(streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_CANCELLED.getCode(),
                "Stream terminated successfully"));
    }

    @PostMapping("/{streamId}/credentials/rotate")
    public ResponseEntity<ApiResponse<StreamProvisionResponse>> rotateCredentials(@PathVariable UUID streamId) {
        StreamProvisionResponse response = streamService.rotateCredentials(
                streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_CREDENTIALS_ROTATED.getCode(),
                "Stream credentials rotated successfully"));
    }

    @DeleteMapping("/{streamId}/credentials")
    public ResponseEntity<Void> revokeCredentials(@PathVariable UUID streamId) {
        streamService.revokeCredentials(streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{streamId}/playback")
    public ResponseEntity<ApiResponse<PlaybackResponse>> playback(@PathVariable UUID streamId) {
        PlaybackResponse response = streamService.getPlayback(
                streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_PLAYBACK.getCode(),
                "Stream playback retrieved successfully"));
    }

    @PostMapping("/{streamId}/views")
    public ResponseEntity<ApiResponse<ViewSessionResponse>> startView(
            @PathVariable UUID streamId,
            @Valid @RequestBody ViewStartRequest request) {
        ViewSessionResponse response = streamViewService.startView(
                streamId, currentUserProvider.getRequiredUserId(), request);
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_VIEW_STARTED.getCode(),
                "Stream view session started successfully"));
    }

    @PostMapping("/{streamId}/views/{sessionId}/heartbeat")
    public ResponseEntity<ApiResponse<ViewSessionResponse>> heartbeat(
            @PathVariable UUID streamId,
            @PathVariable String sessionId) {
        ViewSessionResponse response = streamViewService.heartbeat(
                streamId, currentUserProvider.getRequiredUserId(), sessionId);
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_VIEW_UPDATED.getCode(),
                "Stream view session updated successfully"));
    }

    @DeleteMapping("/{streamId}/views/{sessionId}")
    public ResponseEntity<ApiResponse<ViewSessionResponse>> stopView(
            @PathVariable UUID streamId,
            @PathVariable String sessionId) {
        ViewSessionResponse response = streamViewService.stopView(
                streamId, currentUserProvider.getRequiredUserId(), sessionId);
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_VIEW_UPDATED.getCode(),
                "Stream view session stopped successfully"));
    }

    @PutMapping("/{streamId}/like")
    public ResponseEntity<ApiResponse<EngagementResponse>> like(@PathVariable UUID streamId) {
        EngagementResponse response = streamEngagementService.like(streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_LIKE_UPDATED.getCode(),
                "Stream like updated successfully"));
    }

    @DeleteMapping("/{streamId}/like")
    public ResponseEntity<ApiResponse<EngagementResponse>> unlike(@PathVariable UUID streamId) {
        EngagementResponse response = streamEngagementService.unlike(streamId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_LIKE_UPDATED.getCode(),
                "Stream like removed successfully"));
    }

    @GetMapping("/{streamId}/statistics")
    public ResponseEntity<ApiResponse<StreamStatisticsResponse>> statistics(
            @PathVariable UUID streamId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        StreamStatisticsResponse response = streamStatisticsService.getStatistics(
                streamId, currentUserProvider.getRequiredUserId(), from, to);
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_STATISTICS.getCode(),
                "Stream statistics retrieved successfully"));
    }
}
