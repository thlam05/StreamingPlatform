package com.thlam.streaming.chat.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;

import com.thlam.streaming.chat.dto.request.ChatMessageRequest;
import com.thlam.streaming.chat.dto.response.ChatMessageResponse;
import com.thlam.streaming.chat.entity.ChatMessage;
import com.thlam.streaming.chat.entity.ChatMessageStatus;
import com.thlam.streaming.chat.repository.ChatMessageRepository;
import com.thlam.streaming.chat.repository.ModerationResultRepository;
import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.user.dto.response.UserSummary;
import com.thlam.streaming.user.service.UserService;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ChatServiceImplTest {

    private static final UUID STREAM_ID = UUID.randomUUID();
    private static final UUID SENDER_ID = UUID.randomUUID();

    @Mock
    private ChatMessageRepository chatMessageRepository;
    @Mock
    private ModerationResultRepository moderationResultRepository;
    @Mock
    private StreamRepository streamRepository;
    @Mock
    private UserService userService;

    private ChatServiceImpl chatService;
    private UserSummary sender;

    @BeforeEach
    void setUp() {
        chatService = new ChatServiceImpl(
                chatMessageRepository, moderationResultRepository, streamRepository, userService);
        Stream stream = new Stream(
                STREAM_ID, UUID.randomUUID(), UUID.randomUUID(), "Live stream", null, null, null);
        stream.markLive("http://localhost/live/stream.m3u8", Instant.now());
        when(streamRepository.findById(STREAM_ID)).thenReturn(Optional.of(stream));
        lenient().when(userService.isActive(SENDER_ID)).thenReturn(true);
        sender = new UserSummary(SENDER_ID, "viewer", "Viewer", null);
        lenient().when(userService.getPublicProfiles(anyCollection())).thenReturn(Map.of(SENDER_ID, sender));
        lenient().when(chatMessageRepository.save(any(ChatMessage.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void storesModerationResultAndPublishesTrimmedMessage() {
        ChatMessageResponse response = chatService.sendMessage(
                STREAM_ID, SENDER_ID, new ChatMessageRequest("  Hello chat  ", "client-1"));

        assertThat(response.message()).isEqualTo("Hello chat");
        verify(chatMessageRepository).save(any(ChatMessage.class));
        verify(moderationResultRepository).save(any());
    }

    @Test
    void returnsExistingMessageWhenClientRetriesSameRequest() {
        ChatMessage existing = new ChatMessage(STREAM_ID, SENDER_ID, "client-1", "Hello chat");
        existing.applyModeration(ChatMessageStatus.VISIBLE);
        when(chatMessageRepository.findByStreamIdAndSenderIdAndClientMessageId(
                STREAM_ID, SENDER_ID, "client-1")).thenReturn(Optional.of(existing));

        ChatMessageResponse response = chatService.sendMessage(
                STREAM_ID, SENDER_ID, new ChatMessageRequest("Hello chat", "client-1"));

        assertThat(response.id()).isEqualTo(existing.getId());
        verify(chatMessageRepository, never()).save(any(ChatMessage.class));
        verify(moderationResultRepository, never()).save(any());
    }

    @Test
    void rejectsBlankMessagesEvenWhenCalledFromWebSocket() {
        assertThatThrownBy(() -> chatService.sendMessage(
                STREAM_ID, SENDER_ID, new ChatMessageRequest("   ", "client-1")))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage("Message is required");
    }
}
