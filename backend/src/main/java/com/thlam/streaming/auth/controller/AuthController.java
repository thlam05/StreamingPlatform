package com.thlam.streaming.auth.controller;

import com.thlam.streaming.auth.dto.request.LoginRequest;
import com.thlam.streaming.auth.dto.request.RegisterRequest;
import com.thlam.streaming.auth.dto.response.AuthResponse;
import com.thlam.streaming.auth.service.AuthService;
import com.thlam.streaming.common.dtos.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String REGISTER_CODE = "USER_REGISTERED";
    private static final String LOGIN_CODE = "LOGIN_SUCCESS";

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(response, REGISTER_CODE, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(response, LOGIN_CODE, "Login successful"));
    }
}
