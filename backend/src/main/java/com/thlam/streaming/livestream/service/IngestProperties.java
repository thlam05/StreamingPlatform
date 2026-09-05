package com.thlam.streaming.livestream.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.ingest")
public class IngestProperties {

    private String rtmpUrl;
    private String callbackSecret;
}
