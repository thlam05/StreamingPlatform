package com.thlam.streaming.livestream.repository;

import com.thlam.streaming.livestream.entity.StreamStatsDaily;
import com.thlam.streaming.livestream.entity.StreamStatsDailyId;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StreamStatsDailyRepository extends JpaRepository<StreamStatsDaily, StreamStatsDailyId> {

    @Query("select stats from StreamStatsDaily stats "
            + "where stats.id.streamId = :streamId "
            + "and stats.id.statDate between :from and :to "
            + "order by stats.id.statDate asc")
    List<StreamStatsDaily> findForPeriod(
            @Param("streamId") UUID streamId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
}
