package com.thlam.streaming.user.mapper;

import com.thlam.streaming.user.dto.response.UserResponse;
import com.thlam.streaming.user.dto.response.UserSummary;
import com.thlam.streaming.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getStatus().getCode(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    public UserSummary toSummary(User user) {
        return new UserSummary(user.getId(), user.getUsername(), user.getDisplayName(), user.getAvatarUrl());
    }
}
