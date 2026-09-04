package com.thlam.streaming.livestream.controller;

import com.thlam.streaming.common.dtos.ApiResponse;
import com.thlam.streaming.common.enums.ApiResponseCode;
import com.thlam.streaming.common.security.CurrentUserProvider;
import com.thlam.streaming.livestream.dto.response.EngagementResponse;
import com.thlam.streaming.livestream.service.StreamEngagementService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/streamers")
@RequiredArgsConstructor
public class StreamerFollowController {

    private final StreamEngagementService streamEngagementService;
    private final CurrentUserProvider currentUserProvider;

    @PutMapping("/{streamerId}/follow")
    public ResponseEntity<ApiResponse<EngagementResponse>> follow(@PathVariable UUID streamerId) {
        EngagementResponse response = streamEngagementService.follow(
                streamerId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_FOLLOW_UPDATED.getCode(),
                "Streamer follow updated successfully"));
    }

    @DeleteMapping("/{streamerId}/follow")
    public ResponseEntity<ApiResponse<EngagementResponse>> unfollow(@PathVariable UUID streamerId) {
        EngagementResponse response = streamEngagementService.unfollow(
                streamerId, currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.STREAM_FOLLOW_UPDATED.getCode(),
                "Streamer unfollowed successfully"));
    }
}
