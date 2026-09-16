package com.thlam.streaming.storage.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.storage.supabase")
public class SupabaseStorageProperties {

    private String endpoint;
    private String region;
    private String accessKeyId;
    private String secretAccessKey;
    private String avatarsBucket = "avatars";
    private String thumbnailsBucket = "thumbnails";
    private String recordingsBucket = "recordings";
}
