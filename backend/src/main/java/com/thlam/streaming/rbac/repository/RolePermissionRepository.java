package com.thlam.streaming.rbac.repository;

import com.thlam.streaming.rbac.entity.RolePermission;
import com.thlam.streaming.rbac.entity.RolePermissionId;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {

    @Query("select distinct rp.permission.code from RolePermission rp where rp.id.roleId in :roleIds")
    List<String> findPermissionCodesByRoleIds(@Param("roleIds") Collection<UUID> roleIds);
}
