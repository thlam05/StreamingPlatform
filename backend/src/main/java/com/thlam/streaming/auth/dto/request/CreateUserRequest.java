package com.thlam.streaming.auth.dto.request;

import com.thlam.streaming.auth.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
		@NotBlank(message = "Email is required") @Email(message = "Email must be valid") @Size(max = 255, message = "Email must be at most 255 characters") String email,

		@NotBlank(message = "Password is required") @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters") String password,

		@NotBlank(message = "Username is required") @Size(max = 100, message = "Username must be at most 100 characters") String username,

		@NotNull(message = "Role is required") UserRole role) {
}
