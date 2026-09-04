package com.thlam.streaming.livestream.repository;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CategoryLookupRepository {

    private final JdbcTemplate jdbcTemplate;

    public boolean existsActiveLevelTwo(UUID categoryId) {
        Integer count = jdbcTemplate.queryForObject(
                "select count(*) from categories where id = ? and level = 2 and status = 'active'",
                Integer.class,
                categoryId);
        return count != null && count > 0;
    }
}
