package com.thlam.streaming.livestream.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.stream")
public class StreamCredentialProperties {

    private String credentialEncryptionKey;
}
