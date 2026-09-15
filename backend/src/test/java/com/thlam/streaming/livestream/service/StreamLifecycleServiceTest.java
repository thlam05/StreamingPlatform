package com.thlam.streaming.livestream.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;

import com.thlam.streaming.common.exception.ConflictException;
import com.thlam.streaming.livestream.dto.request.SrsHookRequest;
import com.thlam.streaming.livestream.entity.IngestConfigStatus;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.entity.StreamIngestConfig;
import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.mapper.StreamMapper;
import com.thlam.streaming.livestream.repository.StreamIngestConfigRepository;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.storage.service.ObjectStorageService;
import com.thlam.streaming.user.service.UserService;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StreamLifecycleServiceTest {

    private static final UUID STREAM_ID = UUID.randomUUID();
    private static final UUID OWNER_ID = UUID.randomUUID();
    private static final String CLIENT_ID = "srs-client-1";

    @Mock
    private StreamRepository streamRepository;
    @Mock
    private StreamIngestConfigRepository ingestConfigRepository;
    @Mock
    private CategoryService categoryService;
    @Mock
    private StreamCredentialService credentialService;
    @Mock
    private PlaybackUrlService playbackUrlService;
    @Mock
    private StreamStateMachine stateMachine;
    @Mock
    private StreamMapper streamMapper;
    @Mock
    private UserService userService;
    @Mock
    private StreamViewService streamViewService;
    @Mock
    private StreamEngagementService streamEngagementService;
    @Mock
    private StreamAuthorizationService authorizationService;
    @Mock
    private ObjectStorageService objectStorageService;
    @Mock
    private SrsControlService srsControlService;

    private final IngestProperties ingestProperties = new IngestProperties();
    private StreamServiceImpl streamService;
    private Stream stream;
    private StreamIngestConfig config;

    @BeforeEach
    void setUp() {
        ingestProperties.setStartRequestTtl(Duration.ofMinutes(5));
        ingestProperties.setReconnectGracePeriod(Duration.ofSeconds(15));
        ingestProperties.setPublisherConfirmationTimeout(Duration.ofSeconds(30));
        streamService = new StreamServiceImpl(
                streamRepository,
                ingestConfigRepository,
                categoryService,
                credentialService,
                playbackUrlService,
                stateMachine,
                streamMapper,
                userService,
                streamViewService,
                streamEngagementService,
                authorizationService,
                objectStorageService,
                srsControlService,
                ingestProperties);
        stream = new Stream(STREAM_ID, OWNER_ID, UUID.randomUUID(), "Test", null, null, null);
        stream.setScheduledExpiresAt(Instant.now().plus(Duration.ofHours(1)));
        config = new StreamIngestConfig(
                UUID.randomUUID(), STREAM_ID, "rtmp://localhost/live", new byte[] {1}, "fingerprint", "test");
        when(streamRepository.findByIdForUpdate(STREAM_ID)).thenReturn(Optional.of(stream));
        when(ingestConfigRepository.findByStreamIdAndStatus(STREAM_ID, IngestConfigStatus.ACTIVE))
                .thenReturn(Optional.of(config));
        lenient().when(credentialService.matches("secret", config)).thenReturn(true);
        lenient().when(credentialService.playbackUrl(STREAM_ID))
                .thenReturn("http://localhost:8081/hls/live/" + STREAM_ID + ".m3u8");
    }

    @Test
    void publishBeforeStartWaitsInPreviewThenStartsWhenOwnerConfirms() {
        streamService.handleSrsPublish(publish("secret"));

        assertThat(stream.getStatus()).isEqualTo(StreamStatus.PREVIEW);
        assertThat(stream.hasActivePublisher()).isTrue();
        assertThat(stream.getPlaybackUrl())
                .isEqualTo("http://localhost:8081/hls/live/" + STREAM_ID + ".m3u8");

        streamService.requestStreamStart(STREAM_ID, OWNER_ID);

        assertThat(stream.getStatus()).isEqualTo(StreamStatus.LIVE);
        assertThat(stream.getStartedAt()).isNotNull();
    }

    @Test
    void previewUnpublishReturnsToScheduled() {
        streamService.handleSrsPublish(publish("secret"));

        streamService.handleSrsUnpublish(new SrsHookRequest("on_unpublish", "live", STREAM_ID.toString(), null,
                CLIENT_ID, null));

        assertThat(stream.getStatus()).isEqualTo(StreamStatus.SCHEDULED);
        assertThat(stream.hasPublisher()).isFalse();
    }

    @Test
    void reconnectDuringGraceKeepsLiveAndClearsPendingDisconnect() {
        streamService.handleSrsPublish(publish("secret"));
        streamService.requestStreamStart(STREAM_ID, OWNER_ID);
        streamService.handleSrsUnpublish(new SrsHookRequest("on_unpublish", "live", STREAM_ID.toString(), null,
                CLIENT_ID, null));

        streamService.handleSrsPublish(publish("secret"));

        assertThat(stream.getStatus()).isEqualTo(StreamStatus.LIVE);
        assertThat(stream.getUnpublishPendingAt()).isNull();
        assertThat(stream.getStartedAt()).isNotNull();
    }

    @Test
    void staleUnpublishDoesNotEndTheCurrentPublisher() {
        streamService.handleSrsPublish(publish("secret"));
        streamService.requestStreamStart(STREAM_ID, OWNER_ID);

        streamService.handleSrsUnpublish(new SrsHookRequest("on_unpublish", "live", STREAM_ID.toString(), null,
                "old-client", null));

        assertThat(stream.getStatus()).isEqualTo(StreamStatus.LIVE);
        assertThat(stream.getUnpublishPendingAt()).isNull();
    }

    @Test
    void cannotStartScheduledStreamBeforePublisherPreview() {
        assertThatThrownBy(() -> streamService.requestStreamStart(STREAM_ID, OWNER_ID))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Only preview streams can be started");
        assertThat(stream.getStatus()).isEqualTo(StreamStatus.SCHEDULED);

        streamService.handleSrsPublish(publish("secret"));

        assertThat(stream.getStatus()).isEqualTo(StreamStatus.PREVIEW);
    }

    @Test
    void duplicateUnpublishDoesNotExtendGracePeriod() {
        streamService.handleSrsPublish(publish("secret"));
        streamService.requestStreamStart(STREAM_ID, OWNER_ID);
        streamService.handleSrsUnpublish(new SrsHookRequest("on_unpublish", "live", STREAM_ID.toString(), null,
                CLIENT_ID, null));
        Instant firstPendingAt = stream.getUnpublishPendingAt();

        streamService.handleSrsUnpublish(new SrsHookRequest("on_unpublish", "live", STREAM_ID.toString(), null,
                CLIENT_ID, null));

        assertThat(stream.getUnpublishPendingAt()).isEqualTo(firstPendingAt);
    }

    private SrsHookRequest publish(String token) {
        return new SrsHookRequest("on_publish", "live", STREAM_ID.toString(), "?token=" + token, CLIENT_ID, null);
    }
}
