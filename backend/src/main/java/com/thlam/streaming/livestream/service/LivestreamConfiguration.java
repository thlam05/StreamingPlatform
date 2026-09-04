package com.thlam.streaming.livestream.service;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({StreamCredentialProperties.class, IngestProperties.class})
public class LivestreamConfiguration {
}
