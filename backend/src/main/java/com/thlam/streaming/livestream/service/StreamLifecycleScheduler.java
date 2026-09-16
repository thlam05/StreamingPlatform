package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.entity.StreamStatus;
import com.thlam.streaming.livestream.repository.StreamRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StreamLifecycleScheduler {

    private final StreamService streamService;
    private final StreamRepository streamRepository;
    private final IngestProperties ingestProperties;

    @Scheduled(fixedDelayString = "${app.ingest.lifecycle-poll-interval-ms:5000}")
    public void reconcile() {
        Instant now = Instant.now();
        streamRepository.findAllByStatusAndUnpublishPendingAtBefore(
                        StreamStatus.LIVE,
                        now.minus(ingestProperties.getReconnectGracePeriod()))
                .forEach(stream -> streamService.finalizeDisconnect(stream.getId(), now));
        streamRepository.findAllByStatusInAndScheduledExpiresAtBefore(
                        List.of(StreamStatus.SCHEDULED, StreamStatus.PREVIEW), now)
                .forEach(stream -> streamService.expireScheduledStream(stream.getId(), now));
        streamRepository.findAllByStatusAndPublishObservedAtBefore(
                        StreamStatus.PREVIEW,
                        now.minus(ingestProperties.getPublisherConfirmationTimeout()))
                .forEach(stream -> streamService.expirePublisherConfirmation(stream.getId(), now));
        streamRepository.findAllByStatusInAndStartRequestExpiresAtBefore(
                        List.of(StreamStatus.SCHEDULED, StreamStatus.PREVIEW), now)
                .forEach(stream -> streamService.expireStartRequest(stream.getId(), now));
    }
}
