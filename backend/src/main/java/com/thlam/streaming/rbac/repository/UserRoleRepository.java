package com.thlam.streaming.rbac.repository;

import com.thlam.streaming.rbac.entity.Role;
import com.thlam.streaming.rbac.entity.UserRole;
import com.thlam.streaming.rbac.entity.UserRoleId;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

    @Query("select ur.role from UserRole ur where ur.id.userId = :userId order by ur.role.name")
    List<Role> findRolesByUserId(@Param("userId") UUID userId);
}
