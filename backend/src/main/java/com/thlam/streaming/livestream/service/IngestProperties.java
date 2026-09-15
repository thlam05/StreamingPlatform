package com.thlam.streaming.livestream.service;

import lombok.Getter;
import lombok.Setter;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.ingest")
public class IngestProperties {

    private String rtmpUrl;
    private String callbackSecret;
    private String playbackBaseUrl = "http://localhost:8081/hls/live";
    private String srsControlUrl;
    private String srsControlSecret;
    private Duration reconnectGracePeriod = Duration.ofSeconds(15);
    private Duration scheduledStreamTtl = Duration.ofHours(24);
    private Duration startRequestTtl = Duration.ofMinutes(5);
    private Duration publisherConfirmationTimeout = Duration.ofMinutes(5);
    private long lifecyclePollIntervalMs = 5000;
}
