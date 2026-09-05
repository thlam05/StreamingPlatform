package com.thlam.streaming.livestream.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record StreamStatisticsResponse(
        UUID streamId,
        LocalDate from,
        LocalDate to,
        List<DailyStreamStatistics> daily) {
}
