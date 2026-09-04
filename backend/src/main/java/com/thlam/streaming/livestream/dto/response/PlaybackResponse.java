package com.thlam.streaming.livestream.dto.response;

import java.util.UUID;

public record PlaybackResponse(
        UUID streamId,
        String playbackUrl) {
}
