package com.thlam.streaming.livestream.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode
public class StreamStatsDailyId implements Serializable {

    @Column(name = "stream_id", nullable = false)
    private UUID streamId;

    @Column(name = "stat_date", nullable = false)
    private LocalDate statDate;
}
