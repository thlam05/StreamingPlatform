package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.livestream.dto.response.DailyStreamStatistics;
import com.thlam.streaming.livestream.dto.response.StreamStatisticsResponse;
import com.thlam.streaming.livestream.entity.Stream;
import com.thlam.streaming.livestream.mapper.StreamMapper;
import com.thlam.streaming.livestream.repository.StreamRepository;
import com.thlam.streaming.livestream.repository.StreamStatsDailyRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StreamStatisticsServiceImpl implements StreamStatisticsService {

    private final StreamRepository streamRepository;
    private final StreamStatsDailyRepository statsRepository;
    private final StreamMapper streamMapper;
    private final StreamAuthorizationService authorizationService;

    @Override
    public StreamStatisticsResponse getStatistics(
            UUID streamId, UUID actorId, LocalDate from, LocalDate to) {
        if (from == null || to == null || from.isAfter(to)) {
            throw new InvalidRequestException("Statistics date range is invalid");
        }
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new ResourceNotFoundException("Stream not found"));
        authorizationService.ensureOwnerOrPrivileged(stream, actorId, "PERM_stream:moderate");
        List<DailyStreamStatistics> daily = statsRepository.findForPeriod(streamId, from, to).stream()
                .map(streamMapper::toDailyStatistics)
                .toList();
        return new StreamStatisticsResponse(streamId, from, to, daily);
    }
}
