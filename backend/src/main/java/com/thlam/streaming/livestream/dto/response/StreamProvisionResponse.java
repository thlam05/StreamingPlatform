package com.thlam.streaming.livestream.dto.response;

public record StreamProvisionResponse(
        StreamResponse stream,
        String rtmpUrl,
        String streamKey) {
}
