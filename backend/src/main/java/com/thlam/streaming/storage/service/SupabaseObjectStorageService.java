package com.thlam.streaming.storage.service;

import com.thlam.streaming.common.exception.StorageOperationException;
import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.storage.config.SupabaseStorageProperties;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class SupabaseObjectStorageService implements ObjectStorageService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SupabaseObjectStorageService.class);
    private static final long MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
    private static final Map<String, String> IMAGE_EXTENSIONS = Map.of(
            MediaType.IMAGE_JPEG_VALUE, "jpg",
            MediaType.IMAGE_PNG_VALUE, "png",
            "image/webp", "webp",
            "image/gif", "gif");

    private final S3Client s3Client;
    private final SupabaseStorageProperties properties;

    @Override
    public String upload(StorageBucket bucket, String objectKey, MultipartFile file) {
        String contentType = validateFile(bucket, file);
        String bucketName = bucketName(bucket);
        try {
            byte[] content = file.getBytes();
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(objectKey)
                            .contentType(contentType)
                            .cacheControl("public, max-age=31536000, immutable")
                            .build(),
                    RequestBody.fromBytes(content));
            return publicUrl(bucketName, objectKey);
        } catch (IOException | RuntimeException exception) {
            LOGGER.error("Unable to upload object {} to bucket {}", objectKey, bucketName, exception);
            throw new StorageOperationException("Unable to store uploaded file", exception);
        }
    }

    private String validateFile(StorageBucket bucket, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidRequestException("Uploaded file must not be empty");
        }
        if (bucket == StorageBucket.THUMBNAILS && file.getSize() > MAX_THUMBNAIL_SIZE) {
            throw new InvalidRequestException("Thumbnail must not exceed 5 MB");
        }
        String contentType = file.getContentType();
        if (bucket == StorageBucket.THUMBNAILS
                && (contentType == null || !IMAGE_EXTENSIONS.containsKey(contentType))) {
            throw new InvalidRequestException("Thumbnail must be a JPEG, PNG, WebP, or GIF image");
        }
        return contentType;
    }

    private String bucketName(StorageBucket bucket) {
        return switch (bucket) {
            case AVATARS -> properties.getAvatarsBucket();
            case THUMBNAILS -> properties.getThumbnailsBucket();
            case RECORDINGS -> properties.getRecordingsBucket();
        };
    }

    private String publicUrl(String bucketName, String objectKey) {
        String endpoint = properties.getEndpoint().replaceFirst("/+$", "");
        String publicEndpoint = endpoint.replaceFirst("/storage/v1/s3$", "/storage/v1/object/public");
        return publicEndpoint + "/" + bucketName + "/" + objectKey;
    }
}
