package com.thlam.streaming.common.security;

import com.thlam.streaming.common.exception.UnauthorizedException;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {

    public UUID getOptionalUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return null;
        }

        try {
            return UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    public UUID getRequiredUserId() {
        UUID userId = getOptionalUserId();
        if (userId == null) {
            throw new UnauthorizedException("Authentication is required");
        }
        return userId;
    }

    public boolean isCurrentUser(UUID userId) {
        return userId != null && userId.equals(getRequiredUserId());
    }
}
