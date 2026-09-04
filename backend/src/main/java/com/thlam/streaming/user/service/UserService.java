package com.thlam.streaming.user.service;

import com.thlam.streaming.user.dto.request.UpdatePasswordRequest;
import com.thlam.streaming.user.dto.request.UpdateProfileRequest;
import com.thlam.streaming.user.dto.response.UserResponse;
import com.thlam.streaming.user.dto.response.UserSummary;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

public interface UserService {

    @PreAuthorize("permitAll()")
    UserResponse register(
            String username,
            String email,
            String rawPassword,
            String displayName,
            String avatarUrl);

    @PreAuthorize("permitAll()")
    Optional<UserCredentials> findCredentialsByEmail(String email);

    boolean isActive(UUID userId);

    @PreAuthorize("hasAuthority('PERM_user:read')")
    UserResponse getProfile(UUID userId);

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    Map<UUID, UserSummary> getPublicProfiles(Collection<UUID> userIds);

    @PreAuthorize("hasAuthority('PERM_user:update') or @currentUserProvider.isCurrentUser(#p0)")
    UserResponse updateProfile(UUID userId, UpdateProfileRequest request);

    @PreAuthorize("hasAuthority('PERM_user:update') or @currentUserProvider.isCurrentUser(#p0)")
    void updatePassword(UUID userId, UpdatePasswordRequest request);
}
