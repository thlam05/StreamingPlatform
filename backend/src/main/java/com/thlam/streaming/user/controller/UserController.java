package com.thlam.streaming.user.controller;

import com.thlam.streaming.common.dtos.ApiResponse;
import com.thlam.streaming.common.enums.ApiResponseCode;
import com.thlam.streaming.common.security.CurrentUserProvider;
import com.thlam.streaming.user.dto.request.UpdatePasswordRequest;
import com.thlam.streaming.user.dto.request.UpdateProfileRequest;
import com.thlam.streaming.user.dto.response.UserResponse;
import com.thlam.streaming.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        UserResponse response = userService.getProfile(currentUserProvider.getRequiredUserId());
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.USER_PROFILE.getCode(),
                "User profile retrieved successfully"));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.updateProfile(
                currentUserProvider.getRequiredUserId(), request);
        return ResponseEntity.ok(new ApiResponse<>(response, ApiResponseCode.PROFILE_UPDATED.getCode(),
                "User profile updated successfully"));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @Valid @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(currentUserProvider.getRequiredUserId(), request);
        return ResponseEntity.ok(new ApiResponse<>(null, ApiResponseCode.PASSWORD_UPDATED.getCode(),
                "Password updated successfully"));
    }
}
