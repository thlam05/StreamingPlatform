package com.thlam.streaming.rbac.service;

import com.thlam.streaming.common.security.AuthorizationPort;
import com.thlam.streaming.rbac.dto.response.PermissionResponse;
import com.thlam.streaming.rbac.dto.response.RoleResponse;
import java.util.List;
import java.util.UUID;

public interface RbacService extends AuthorizationPort {

    List<RoleResponse> getRoles();

    List<PermissionResponse> getPermissions();

    List<RoleResponse> getUserRoles(UUID userId);

    void assignRole(UUID userId, String roleName);

    void removeRole(UUID userId, String roleName);
}
