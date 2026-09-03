package com.thlam.streaming.auth.service;

import com.thlam.streaming.auth.dto.request.LoginRequest;
import com.thlam.streaming.auth.dto.request.RegisterRequest;
import com.thlam.streaming.auth.dto.response.AuthResponse;
import com.thlam.streaming.common.exception.InvalidCredentialsException;
import com.thlam.streaming.user.dto.response.UserResponse;
import com.thlam.streaming.user.service.UserCredentials;
import com.thlam.streaming.user.service.UserService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        UserResponse user = userService.register(
                request.username(),
                request.email(),
                request.password(),
                request.displayName(),
                request.avatarUrl());
        return createAuthResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Optional<UserCredentials> credentials = userService.findCredentialsByEmail(request.email());
        UserCredentials userCredentials = credentials
                .filter(candidate -> hasValidPasswordAndStatus(candidate, request.password()))
                .orElseThrow(() -> new InvalidCredentialsException(INVALID_CREDENTIALS_MESSAGE));
        return createAuthResponse(userCredentials.profile());
    }

    private boolean hasValidPasswordAndStatus(UserCredentials credentials, String rawPassword) {
        return "active".equals(credentials.profile().status())
                && passwordEncoder.matches(rawPassword, credentials.passwordHash());
    }

    private AuthResponse createAuthResponse(UserResponse user) {
        return new AuthResponse(
                jwtTokenService.issue(user),
                "Bearer",
                jwtTokenService.expiresInSeconds(),
                user);
    }
}
