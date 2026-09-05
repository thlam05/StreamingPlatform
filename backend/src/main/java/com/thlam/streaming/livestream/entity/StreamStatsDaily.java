package com.thlam.streaming.livestream.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stream_stats_daily")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StreamStatsDaily {

    @EmbeddedId
    private StreamStatsDailyId id;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @Column(name = "unique_viewer_count", nullable = false)
    private long uniqueViewerCount;

    @Column(name = "like_count", nullable = false)
    private long likeCount;

    @Column(name = "chat_message_count", nullable = false)
    private long chatMessageCount;

    @Column(name = "gift_count", nullable = false)
    private long giftCount;
}
