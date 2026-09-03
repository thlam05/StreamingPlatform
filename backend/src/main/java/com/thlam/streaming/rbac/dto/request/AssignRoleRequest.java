package com.thlam.streaming.rbac.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssignRoleRequest(
        @NotBlank(message = "Role name is required")
        @Size(max = 30, message = "Role name must not exceed 30 characters")
        String roleName) {
}
