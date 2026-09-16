package com.thlam.streaming.chat.websocket;

import com.thlam.streaming.chat.dto.request.ChatMessageRequest;
import com.thlam.streaming.chat.dto.response.ChatMessageResponse;
import com.thlam.streaming.chat.service.ChatService;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.common.security.DatabaseJwtAuthenticationConverter;
import com.thlam.streaming.user.service.UserService;
import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler implements WebSocketHandler {

    private static final String STREAM_ID_ATTRIBUTE = ChatWebSocketHandler.class.getName() + ".streamId";
    private static final String USER_ID_ATTRIBUTE = ChatWebSocketHandler.class.getName() + ".userId";
    private static final String AUTHENTICATION_ATTRIBUTE = ChatWebSocketHandler.class.getName() + ".authentication";

    private final ChatService chatService;
    private final JwtDecoder jwtDecoder;
    private final DatabaseJwtAuthenticationConverter jwtAuthenticationConverter;
    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final ConcurrentMap<UUID, Set<WebSocketSession>> sessionsByStream = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        UUID streamId = streamIdFrom(session);
        if (streamId == null) {
            session.close(new CloseStatus(1008, "Invalid stream"));
            return;
        }
        session.getAttributes().put(STREAM_ID_ATTRIBUTE, streamId);
        sessionsByStream.computeIfAbsent(streamId, ignored -> ConcurrentHashMap.newKeySet()).add(session);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        if (!(message instanceof TextMessage textMessage)) {
            return;
        }

        ChatSocketRequest request;
        try {
            request = objectMapper.readValue(textMessage.getPayload(), ChatSocketRequest.class);
        } catch (RuntimeException exception) {
            send(session, new SocketError("invalid_message", "Message is invalid"));
            return;
        }

        if ("auth".equals(request.type())) {
            authenticate(session, request.accessToken());
            return;
        }
        if (!"message".equals(request.type())) {
            send(session, new SocketError("unsupported_message", "Unsupported chat message type"));
            return;
        }

        UUID userId = userIdFrom(session);
        UUID streamId = streamIdFrom(session);
        if (userId == null || streamId == null) {
            session.close(new CloseStatus(1008, "Authentication required"));
            return;
        }

        try {
            ChatMessageResponse response = withAuthentication(session, () -> chatService.sendMessage(
                    streamId, userId, new ChatMessageRequest(request.message(), request.clientMessageId())));
            broadcast(streamId, new SocketChatMessage(response));
        } catch (RuntimeException exception) {
            send(session, new SocketError("message_rejected", safeMessage(exception)));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        if (session.isOpen()) {
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) {
        UUID streamId = streamIdFrom(session);
        if (streamId == null) {
            return;
        }
        Set<WebSocketSession> sessions = sessionsByStream.getOrDefault(streamId, Collections.emptySet());
        sessions.remove(session);
        if (sessions.isEmpty()) {
            sessionsByStream.remove(streamId, sessions);
        }
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    private void authenticate(WebSocketSession session, String accessToken) throws IOException {
        if (accessToken == null || accessToken.isBlank()) {
            session.close(new CloseStatus(1008, "Authentication required"));
            return;
        }
        try {
            Jwt jwt = jwtDecoder.decode(accessToken);
            UUID userId = UUID.fromString(jwt.getSubject());
            if (!userService.isActive(userId)) {
                throw new ResourceNotFoundException("User not found");
            }
            Authentication authentication = jwtAuthenticationConverter.convert(jwt);
            session.getAttributes().put(USER_ID_ATTRIBUTE, userId);
            session.getAttributes().put(AUTHENTICATION_ATTRIBUTE, authentication);
            send(session, new SocketReady());
        } catch (JwtException | IllegalArgumentException | ResourceNotFoundException exception) {
            session.close(new CloseStatus(1008, "Authentication is invalid"));
        }
    }

    private <T> T withAuthentication(WebSocketSession session, AuthenticationSupplier<T> action) {
        Authentication authentication = (Authentication) session.getAttributes().get(AUTHENTICATION_ATTRIBUTE);
        if (authentication == null) {
            throw new IllegalStateException("Authentication is required");
        }
        var previous = SecurityContextHolder.getContext();
        try {
            var context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            return action.get();
        } finally {
            SecurityContextHolder.setContext(previous);
        }
    }

    private String safeMessage(RuntimeException exception) {
        String message = exception.getMessage();
        return message == null || message.isBlank() ? "Message could not be sent" : message;
    }

    private void broadcast(UUID streamId, Object payload) throws IOException {
        String message = objectMapper.writeValueAsString(payload);
        for (WebSocketSession session : sessionsByStream.getOrDefault(streamId, Collections.emptySet())) {
            if (session.isOpen() && userIdFrom(session) != null) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }

    private void send(WebSocketSession session, Object payload) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
        }
    }

    private UUID streamIdFrom(WebSocketSession session) {
        Object attribute = session.getAttributes().get(STREAM_ID_ATTRIBUTE);
        if (attribute instanceof UUID streamId) {
            return streamId;
        }
        String path = session.getUri() == null ? "" : session.getUri().getPath();
        int marker = path.indexOf("/ws/streams/");
        if (marker < 0) {
            return null;
        }
        String streamPart = path.substring(marker + "/ws/streams/".length());
        int suffix = streamPart.indexOf("/chat");
        try {
            return UUID.fromString(suffix < 0 ? streamPart : streamPart.substring(0, suffix));
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private UUID userIdFrom(WebSocketSession session) {
        Object attribute = session.getAttributes().get(USER_ID_ATTRIBUTE);
        return attribute instanceof UUID userId ? userId : null;
    }

    private record ChatSocketRequest(String type, String accessToken, String message, String clientMessageId) {
    }

    @FunctionalInterface
    private interface AuthenticationSupplier<T> {
        T get();
    }

    private record SocketReady(String type) {
        private SocketReady() {
            this("ready");
        }
    }

    private record SocketError(String type, String message) {
    }

    private record SocketChatMessage(String type, ChatMessageResponse message) {
        private SocketChatMessage(ChatMessageResponse message) {
            this("message", message);
        }
    }
}
