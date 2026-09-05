package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.entity.Stream;
import java.util.Arrays;
import java.util.UUID;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class StreamAuthorizationService {

    public void ensureOwnerOrPrivileged(Stream stream, UUID actorId, String... permissions) {
        if (stream.getStreamerId().equals(actorId)) {
            return;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean privileged = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> Arrays.stream(permissions)
                        .anyMatch(permission -> permission.equals(authority.getAuthority())));
        if (!privileged) {
            throw new AccessDeniedException("The actor cannot manage this stream");
        }
    }
}
