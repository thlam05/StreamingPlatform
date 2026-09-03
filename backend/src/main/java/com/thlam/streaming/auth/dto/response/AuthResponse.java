package com.thlam.streaming.auth.dto.response;

import com.thlam.streaming.user.dto.response.UserResponse;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        UserResponse user) {
}
