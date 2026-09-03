package com.thlam.streaming.auth.service;

import com.thlam.streaming.auth.dto.request.CreateUserRequest;
import com.thlam.streaming.auth.dto.request.UpdateUserRequest;
import com.thlam.streaming.auth.dto.response.UserResponse;
import java.util.List;
import java.util.UUID;

public interface UserService {

    UserResponse create(CreateUserRequest request);

    List<UserResponse> findAll();

    UserResponse findById(UUID id);

    UserResponse update(UUID id, UpdateUserRequest request);

    void delete(UUID id);
}
