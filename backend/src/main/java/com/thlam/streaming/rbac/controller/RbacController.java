package com.thlam.streaming.rbac.controller;

import com.thlam.streaming.common.dtos.ApiResponse;
import com.thlam.streaming.common.enums.ApiResponseCode;
import com.thlam.streaming.rbac.dto.request.AssignRoleRequest;
import com.thlam.streaming.rbac.dto.response.PermissionResponse;
import com.thlam.streaming.rbac.dto.response.RoleResponse;
import com.thlam.streaming.rbac.service.RbacService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rbac")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('PERM_rbac:manage')")
public class RbacController {

    private final RbacService rbacService;

    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getRoles() {
        return ResponseEntity.ok(new ApiResponse<>(
                rbacService.getRoles(),
                ApiResponseCode.ROLES_RETRIEVED.getCode(),
                "Roles retrieved successfully"));
    }

    @GetMapping("/permissions")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getPermissions() {
        return ResponseEntity.ok(new ApiResponse<>(
                rbacService.getPermissions(),
                ApiResponseCode.PERMISSIONS_RETRIEVED.getCode(),
                "Permissions retrieved successfully"));
    }

    @GetMapping("/users/{userId}/roles")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getUserRoles(@PathVariable UUID userId) {
        return ResponseEntity.ok(new ApiResponse<>(
                rbacService.getUserRoles(userId),
                ApiResponseCode.USER_ROLES_RETRIEVED.getCode(),
                "User roles retrieved successfully"));
    }

    @PostMapping("/users/{userId}/roles")
    public ResponseEntity<ApiResponse<Void>> assignRole(
            @PathVariable UUID userId,
            @Valid @RequestBody AssignRoleRequest request) {
        rbacService.assignRole(userId, request.roleName());
        return ResponseEntity.ok(new ApiResponse<>(
                null,
                ApiResponseCode.USER_ROLE_ASSIGNED.getCode(),
                "Role assigned successfully"));
    }

    @DeleteMapping("/users/{userId}/roles/{roleName}")
    public ResponseEntity<ApiResponse<Void>> removeRole(
            @PathVariable UUID userId,
            @PathVariable String roleName) {
        rbacService.removeRole(userId, roleName);
        return ResponseEntity.ok(new ApiResponse<>(
                null,
                ApiResponseCode.USER_ROLE_REMOVED.getCode(),
                "Role removed successfully"));
    }
}
