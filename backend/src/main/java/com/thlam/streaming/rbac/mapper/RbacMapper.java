package com.thlam.streaming.rbac.mapper;

import com.thlam.streaming.rbac.dto.response.PermissionResponse;
import com.thlam.streaming.rbac.dto.response.RoleResponse;
import com.thlam.streaming.rbac.entity.Permission;
import com.thlam.streaming.rbac.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RbacMapper {

    public RoleResponse toRoleResponse(Role role) {
        return new RoleResponse(role.getId(), role.getName());
    }

    public PermissionResponse toPermissionResponse(Permission permission) {
        return new PermissionResponse(
                permission.getId(),
                permission.getCode(),
                permission.getName(),
                permission.getDescription(),
                permission.getResource(),
                permission.getAction(),
                permission.getCreatedAt());
    }
}
