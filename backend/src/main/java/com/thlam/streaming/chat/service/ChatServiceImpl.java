package com.thlam.streaming.chat.service;

import com.thlam.streaming.chat.dto.request.ChatMessageRequest;
import com.thlam.streaming.chat.dto.response.ChatMessageResponse;
import com.thlam.streaming.chat.entity.ChatMessage;
import com.thlam.streaming.chat.entity.ChatMessageStatus;
import com.thlam.streaming.chat.entity.ModerationResult;
import com.thlam.streaming.chat.repository.ChatMessageRepository;
import com.thlam.streaming.chat.repository.ModerationResultRepository;
import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.user.dto.response.UserSummary;
import com.thlam.streaming.user.service.UserService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatServiceImpl implements ChatService {

    private static final int MAX_MESSAGE_LENGTH = 500;
    private static final int MAX_CLIENT_MESSAGE_ID_LENGTH = 100;

    private final ChatMessageRepository chatMessageRepository;
    private final ModerationResultRepository moderationResultRepository;
    private final StreamRepository streamRepository;
    private final UserService userService;

    @Override
    @PreAuthorize("hasAuthority('PERM_stream:read')")
    public List<ChatMessageResponse> findVisibleMessages(UUID streamId) {
        ensureLive(streamId);
        List<ChatMessage> messages = chatMessageRepository.findTop50ByStreamIdAndStatusOrderByCreatedAtDescIdDesc(
                streamId, ChatMessageStatus.VISIBLE);
        Map<UUID, UserSummary> senders = userService.getPublicProfiles(
                messages.stream().map(ChatMessage::getSenderId).collect(Collectors.toSet()));
        return messages.reversed().stream()
                .map(message -> toResponse(message, senders.get(message.getSenderId())))
                .filter(response -> response.sender() != null)
                .toList();
    }

    @Override
    @PreAuthorize("hasAuthority('PERM_chat:send')")
    @Transactional
    public ChatMessageResponse sendMessage(UUID streamId, UUID senderId, ChatMessageRequest request) {
        ensureLive(streamId);
        String messageText = normalizeMessage(request.message());
        String clientMessageId = normalizeClientMessageId(request.clientMessageId());
        if (!userService.isActive(senderId)) {
            throw new ResourceNotFoundException("User not found");
        }
        ChatMessage existing = chatMessageRepository.findByStreamIdAndSenderIdAndClientMessageId(
                streamId, senderId, clientMessageId).orElse(null);
        if (existing != null) {
            UserSummary existingSender = userService.getPublicProfiles(List.of(senderId)).get(senderId);
            return toResponse(existing, existingSender);
        }
        ChatMessage message = chatMessageRepository.save(
                new ChatMessage(streamId, senderId, clientMessageId, messageText));
        moderationResultRepository.save(new ModerationResult(
                message.getId(), "phase-0-rule-engine", BigDecimal.ZERO, null, "allow"));
        message.applyModeration(ChatMessageStatus.VISIBLE);
        UserSummary sender = userService.getPublicProfiles(List.of(senderId)).get(senderId);
        if (sender == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return toResponse(message, sender);
    }

    private String normalizeMessage(String message) {
        if (message == null || message.isBlank()) {
            throw new InvalidRequestException("Message is required");
        }
        String normalized = message.trim();
        if (normalized.length() > MAX_MESSAGE_LENGTH) {
            throw new InvalidRequestException("Message must contain at most 500 characters");
        }
        return normalized;
    }

    private String normalizeClientMessageId(String clientMessageId) {
        if (clientMessageId == null || clientMessageId.isBlank()) {
            throw new InvalidRequestException("Client message id is required");
        }
        String normalized = clientMessageId.trim();
        if (normalized.length() > MAX_CLIENT_MESSAGE_ID_LENGTH) {
            throw new InvalidRequestException("Client message id must contain at most 100 characters");
        }
        return normalized;
    }

    private void ensureLive(UUID streamId) {
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new ResourceNotFoundException("Stream not found"));
        if (stream.getStatus() != StreamStatus.LIVE) {
            throw new ResourceNotFoundException("Chat is unavailable");
        }
    }

    private ChatMessageResponse toResponse(ChatMessage message, UserSummary sender) {
        return new ChatMessageResponse(
                message.getId(),
                message.getStreamId(),
                sender,
                message.getMessageText(),
                message.getStatus().getCode(),
                message.getCreatedAt());
    }
}
