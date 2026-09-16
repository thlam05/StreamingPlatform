package com.thlam.streaming.chat.repository;

import com.thlam.streaming.chat.entity.ChatMessage;
import com.thlam.streaming.chat.entity.ChatMessageStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    Optional<ChatMessage> findByStreamIdAndSenderIdAndClientMessageId(
            UUID streamId, UUID senderId, String clientMessageId);

    List<ChatMessage> findTop50ByStreamIdAndStatusOrderByCreatedAtDescIdDesc(
            UUID streamId, ChatMessageStatus status);
}
