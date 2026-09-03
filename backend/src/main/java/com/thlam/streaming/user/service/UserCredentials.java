package com.thlam.streaming.user.service;

import com.thlam.streaming.user.dto.response.UserResponse;

public record UserCredentials(
        String passwordHash,
        UserResponse profile) {
}
