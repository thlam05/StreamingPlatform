package com.thlam.streaming.user.service;

import com.thlam.streaming.common.exception.ConflictException;
import com.thlam.streaming.common.exception.InvalidCredentialsException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.user.dto.request.UpdatePasswordRequest;
import com.thlam.streaming.user.dto.request.UpdateProfileRequest;
import com.thlam.streaming.user.dto.response.UserResponse;
import com.thlam.streaming.user.entity.User;
import com.thlam.streaming.user.entity.UserStatus;
import com.thlam.streaming.user.mapper.UserMapper;
import com.thlam.streaming.user.repository.UserRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse register(
            String username,
            String email,
            String rawPassword,
            String displayName,
            String avatarUrl) {
        ensureUnique(username, email, null);
        User user = new User(
                UUID.randomUUID(),
                username,
                email,
                passwordEncoder.encode(rawPassword),
                displayName,
                avatarUrl,
                UserStatus.ACTIVE);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public Optional<UserCredentials> findCredentialsByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .map(user -> new UserCredentials(user.getPasswordHash(), userMapper.toResponse(user)));
    }

    @Override
    public UserResponse getProfile(UUID userId) {
        return userMapper.toResponse(getActiveUser(userId));
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = getActiveUser(userId);
        ensureUnique(request.username(), request.email(), userId);
        user.updateProfile(request.username(), request.email(), request.displayName(), request.avatarUrl());
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public void updatePassword(UUID userId, UpdatePasswordRequest request) {
        User user = getActiveUser(userId);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ConflictException("New password must be different from the current password");
        }
        user.updatePassword(passwordEncoder.encode(request.newPassword()));
    }

    private User getActiveUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResourceNotFoundException("User not found");
        }
        return user;
    }

    private void ensureUnique(String username, String email, UUID currentUserId) {
        userRepository.findByUsernameIgnoreCase(username)
                .filter(existing -> !existing.getId().equals(currentUserId))
                .ifPresent(existing -> {
                    throw new ConflictException("Email or username is already in use");
                });
        userRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(currentUserId))
                .ifPresent(existing -> {
                    throw new ConflictException("Email or username is already in use");
                });
    }
}
