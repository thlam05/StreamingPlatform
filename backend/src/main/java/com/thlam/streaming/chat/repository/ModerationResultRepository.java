package com.thlam.streaming.chat.repository;

import com.thlam.streaming.chat.entity.ModerationResult;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModerationResultRepository extends JpaRepository<ModerationResult, UUID> {
}
