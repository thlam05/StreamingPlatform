package com.thlam.streaming.livestream.service;

import org.springframework.stereotype.Service;

@Service
public class PlaybackUrlService {

    public static final String QUALITY_720P = "720p";
    public static final String QUALITY_360P = "360p";

    public String variantUrl(String playbackUrl, String variant) {
        if (playbackUrl == null || playbackUrl.isBlank()) {
            return null;
        }
        int extensionIndex = playbackUrl.lastIndexOf(".m3u8");
        if (extensionIndex < 0) {
            return playbackUrl + "_" + variant;
        }
        return playbackUrl.substring(0, extensionIndex) + "_" + variant + playbackUrl.substring(extensionIndex);
    }
}
