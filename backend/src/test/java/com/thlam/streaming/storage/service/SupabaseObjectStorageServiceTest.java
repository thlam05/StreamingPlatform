package com.thlam.streaming.storage.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.storage.config.SupabaseStorageProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

class SupabaseObjectStorageServiceTest {

    private S3Client s3Client;
    private SupabaseObjectStorageService storageService;

    @BeforeEach
    void setUp() {
        s3Client = mock(S3Client.class);
        SupabaseStorageProperties properties = new SupabaseStorageProperties();
        properties.setEndpoint("https://project-ref.storage.supabase.co/storage/v1/s3");
        properties.setThumbnailsBucket("thumbnails");
        storageService = new SupabaseObjectStorageService(s3Client, properties);
    }

    @Test
    void uploadsThumbnailAndReturnsPublicUrl() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "thumbnail.png", "image/png", new byte[] {1, 2, 3});

        String url = storageService.upload(StorageBucket.THUMBNAILS, "streams/stream-id/thumbnail.png", file);

        assertThat(url).isEqualTo(
                "https://project-ref.storage.supabase.co/storage/v1/object/public/thumbnails/streams/stream-id/thumbnail.png");
        verify(s3Client).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    void rejectsNonImageThumbnail() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "thumbnail.txt", "text/plain", new byte[] {1, 2, 3});

        assertThatThrownBy(() -> storageService.upload(StorageBucket.THUMBNAILS, "thumbnail.txt", file))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("JPEG");
    }
}
