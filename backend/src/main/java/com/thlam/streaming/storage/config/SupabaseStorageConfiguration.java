package com.thlam.streaming.storage.config;

import com.thlam.streaming.common.utils.ConfigurationUtils;
import java.net.URI;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@EnableConfigurationProperties(SupabaseStorageProperties.class)
public class SupabaseStorageConfiguration {

    @Bean
    S3Client supabaseStorageClient(SupabaseStorageProperties properties) {
        requireConfigured(properties);
        return S3Client.builder()
                .forcePathStyle(true)
                .endpointOverride(URI.create(properties.getEndpoint()))
                .region(Region.of(properties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(properties.getAccessKeyId(), properties.getSecretAccessKey())))
                .build();
    }

    private void requireConfigured(SupabaseStorageProperties properties) {
        ConfigurationUtils.requireProperty(properties.getEndpoint(), "SUPABASE_STORAGE_ENDPOINT");
        ConfigurationUtils.requireProperty(properties.getRegion(), "SUPABASE_STORAGE_REGION");
        ConfigurationUtils.requireProperty(properties.getAccessKeyId(), "SUPABASE_STORAGE_ACCESS_KEY_ID");
        ConfigurationUtils.requireProperty(properties.getSecretAccessKey(), "SUPABASE_STORAGE_SECRET_ACCESS_KEY");
        ConfigurationUtils.requireProperty(properties.getThumbnailsBucket(), "SUPABASE_STORAGE_THUMBNAILS_BUCKET");
    }
}
