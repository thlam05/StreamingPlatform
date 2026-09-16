package com.thlam.streaming.storage.service;

import org.springframework.web.multipart.MultipartFile;

public interface ObjectStorageService {

    String upload(StorageBucket bucket, String objectKey, MultipartFile file);
}
