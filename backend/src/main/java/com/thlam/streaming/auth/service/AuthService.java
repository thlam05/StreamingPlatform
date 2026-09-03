package com.thlam.streaming.auth.service;

import com.thlam.streaming.auth.dto.request.LoginRequest;
import com.thlam.streaming.auth.dto.request.RegisterRequest;
import com.thlam.streaming.auth.dto.response.AuthResponse;
import org.springframework.security.access.prepost.PreAuthorize;

public interface AuthService {

    @PreAuthorize("permitAll()")
    AuthResponse register(RegisterRequest request);

    @PreAuthorize("permitAll()")
    AuthResponse login(LoginRequest request);
}
