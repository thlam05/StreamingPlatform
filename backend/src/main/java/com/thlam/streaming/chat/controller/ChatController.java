package com.thlam.streaming.chat.controller;

import com.thlam.streaming.chat.dto.request.ChatMessageRequest;
import com.thlam.streaming.chat.dto.response.ChatMessageResponse;
import com.thlam.streaming.chat.service.ChatService;
import com.thlam.streaming.common.dtos.ApiResponse;
import com.thlam.streaming.common.enums.ApiResponseCode;
import com.thlam.streaming.common.security.CurrentUserProvider;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/streams/{streamId}/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> findMessages(@PathVariable UUID streamId) {
        return ResponseEntity.ok(new ApiResponse<>(
                chatService.findVisibleMessages(streamId),
                ApiResponseCode.CHAT_MESSAGES_RETRIEVED.getCode(),
                "Chat messages retrieved successfully"));
    }

    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @PathVariable UUID streamId,
            @Valid @RequestBody ChatMessageRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(
                chatService.sendMessage(streamId, currentUserProvider.getRequiredUserId(), request),
                ApiResponseCode.CHAT_MESSAGE_SENT.getCode(),
                "Chat message sent successfully"));
    }
}
