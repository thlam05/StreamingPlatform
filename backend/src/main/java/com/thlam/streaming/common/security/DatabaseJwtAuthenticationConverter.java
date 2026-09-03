package com.thlam.streaming.common.security;

import java.util.Collections;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseJwtAuthenticationConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    private final AuthorizationPort authorizationPort;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        UUID userId = parseUserId(jwt.getSubject());
        if (userId == null) {
            return new JwtAuthenticationToken(jwt, Collections.emptyList());
        }

        return new JwtAuthenticationToken(jwt, authorizationPort.getAuthorities(userId));
    }

    private UUID parseUserId(String subject) {
        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException | NullPointerException exception) {
            return null;
        }
    }
}
