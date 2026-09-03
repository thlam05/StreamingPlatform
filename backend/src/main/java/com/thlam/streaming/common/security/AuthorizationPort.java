package com.thlam.streaming.common.security;

import java.util.Set;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;

public interface AuthorizationPort {

    Set<GrantedAuthority> getAuthorities(UUID userId);

    void assignDefaultRole(UUID userId);
}
