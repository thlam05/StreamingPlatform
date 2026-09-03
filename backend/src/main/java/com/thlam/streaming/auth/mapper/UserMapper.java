package com.thlam.streaming.auth.mapper;

import com.thlam.streaming.auth.dto.response.UserResponse;
import com.thlam.streaming.auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
