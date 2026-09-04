package com.thlam.streaming.livestream.dto.response;

import java.time.LocalDate;

public record DailyStreamStatistics(
        LocalDate date,
        long viewCount,
        long uniqueViewerCount,
        long likeCount,
        long chatMessageCount,
        long giftCount) {
}
