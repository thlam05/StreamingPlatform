package com.thlam.streaming.user.service;

import com.thlam.streaming.user.dto.request.UpdatePasswordRequest;
import com.thlam.streaming.user.dto.request.UpdateProfileRequest;
import com.thlam.streaming.user.dto.response.UserResponse;
import java.util.Optional;
import java.util.UUID;

public interface UserService {

    UserResponse register(
            String username,
            String email,
            String rawPassword,
            String displayName,
            String avatarUrl);

    Optional<UserCredentials> findCredentialsByEmail(String email);

    boolean isActive(UUID userId);

    UserResponse getProfile(UUID userId);

    UserResponse updateProfile(UUID userId, UpdateProfileRequest request);

    void updatePassword(UUID userId, UpdatePasswordRequest request);
}
