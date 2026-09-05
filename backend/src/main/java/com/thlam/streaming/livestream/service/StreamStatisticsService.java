package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.dto.response.StreamStatisticsResponse;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

public interface StreamStatisticsService {

    @PreAuthorize("hasAuthority('PERM_stream:stats:read')")
    StreamStatisticsResponse getStatistics(
            UUID streamId, UUID actorId, LocalDate from, LocalDate to);
}
