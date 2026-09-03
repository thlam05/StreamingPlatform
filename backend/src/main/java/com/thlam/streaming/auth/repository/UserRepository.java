package com.thlam.streaming.auth.repository;

import com.thlam.streaming.auth.entity.User;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);
}
