package com.thlam.streaming.rbac.repository;

import com.thlam.streaming.rbac.entity.Permission;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    List<Permission> findAllByOrderByCodeAsc();
}
