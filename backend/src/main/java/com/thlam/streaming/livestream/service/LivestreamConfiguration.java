package com.thlam.streaming.livestream.service;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
@EnableConfigurationProperties({StreamCredentialProperties.class, IngestProperties.class})
public class LivestreamConfiguration {
}
