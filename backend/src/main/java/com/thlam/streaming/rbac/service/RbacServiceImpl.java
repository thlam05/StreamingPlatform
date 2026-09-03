package com.thlam.streaming.rbac.service;

import com.thlam.streaming.common.enums.RoleName;
import com.thlam.streaming.common.exception.ConflictException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.rbac.dto.response.PermissionResponse;
import com.thlam.streaming.rbac.dto.response.RoleResponse;
import com.thlam.streaming.rbac.entity.Role;
import com.thlam.streaming.rbac.entity.UserRole;
import com.thlam.streaming.rbac.entity.UserRoleId;
import com.thlam.streaming.rbac.mapper.RbacMapper;
import com.thlam.streaming.rbac.repository.PermissionRepository;
import com.thlam.streaming.rbac.repository.RolePermissionRepository;
import com.thlam.streaming.rbac.repository.RoleRepository;
import com.thlam.streaming.rbac.repository.UserRoleRepository;
import com.thlam.streaming.user.service.UserService;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RbacServiceImpl implements RbacService {

    private static final String PERMISSION_AUTHORITY_PREFIX = "PERM_";

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRoleRepository userRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final RbacMapper rbacMapper;
    private final UserService userService;

    @Override
    public Set<GrantedAuthority> getAuthorities(UUID userId) {
        if (!userService.isActive(userId)) {
            return Set.of();
        }
        List<Role> roles = userRoleRepository.findRolesByUserId(userId);
        if (roles.isEmpty()) {
            return Set.of();
        }

        Set<UUID> roleIds = roles.stream()
                .map(Role::getId)
                .collect(Collectors.toCollection(HashSet::new));
        return rolePermissionRepository.findPermissionCodesByRoleIds(roleIds).stream()
                .map(code -> new SimpleGrantedAuthority(PERMISSION_AUTHORITY_PREFIX + code))
                .collect(Collectors.toUnmodifiableSet());
    }

    @Override
    @Transactional
    public void assignDefaultRole(UUID userId) {
        assignRole(userId, RoleName.VIEWER.getCode());
    }

    @Override
    public List<RoleResponse> getRoles() {
        return roleRepository.findAll().stream()
                .map(rbacMapper::toRoleResponse)
                .toList();
    }

    @Override
    public List<PermissionResponse> getPermissions() {
        return permissionRepository.findAllByOrderByCodeAsc().stream()
                .map(rbacMapper::toPermissionResponse)
                .toList();
    }

    @Override
    public List<RoleResponse> getUserRoles(UUID userId) {
        userService.getProfile(userId);
        return userRoleRepository.findRolesByUserId(userId).stream()
                .map(rbacMapper::toRoleResponse)
                .toList();
    }

    @Override
    @Transactional
    public void assignRole(UUID userId, String roleName) {
        userService.getProfile(userId);
        Role role = findRole(roleName);
        UserRoleId userRoleId = new UserRoleId(userId, role.getId());
        if (userRoleRepository.existsById(userRoleId)) {
            throw new ConflictException("User already has this role");
        }
        userRoleRepository.save(new UserRole(userRoleId, role, Instant.now()));
    }

    @Override
    @Transactional
    public void removeRole(UUID userId, String roleName) {
        userService.getProfile(userId);
        Role role = findRole(roleName);
        UserRoleId userRoleId = new UserRoleId(userId, role.getId());
        if (!userRoleRepository.existsById(userRoleId)) {
            throw new ResourceNotFoundException("User does not have this role");
        }
        userRoleRepository.deleteById(userRoleId);
    }

    private Role findRole(String roleName) {
        return roleRepository.findByNameIgnoreCase(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
    }
}
