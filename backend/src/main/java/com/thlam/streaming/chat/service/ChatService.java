package com.thlam.streaming.chat.service;

import com.thlam.streaming.chat.dto.request.ChatMessageRequest;
import com.thlam.streaming.chat.dto.response.ChatMessageResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

public interface ChatService {

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    List<ChatMessageResponse> findVisibleMessages(UUID streamId);

    @PreAuthorize("hasAuthority('PERM_chat:send')")
    ChatMessageResponse sendMessage(UUID streamId, UUID senderId, ChatMessageRequest request);
}
