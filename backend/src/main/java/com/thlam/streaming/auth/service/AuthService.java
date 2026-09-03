package com.thlam.streaming.auth.service;

import com.thlam.streaming.auth.dto.request.LoginRequest;
import com.thlam.streaming.auth.dto.request.RegisterRequest;
import com.thlam.streaming.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
