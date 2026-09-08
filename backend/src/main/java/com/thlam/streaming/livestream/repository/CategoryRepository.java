package com.thlam.streaming.livestream.repository;

import com.thlam.streaming.livestream.entity.Category;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findAllByStatusOrderByLevelAscNameAsc(String status);

    List<Category> findAllByParentIdAndLevelAndStatusOrderByNameAsc(
            UUID parentId, Short level, String status);

    Optional<Category> findByIdAndStatus(UUID id, String status);

    boolean existsByIdAndLevelAndStatus(UUID id, Short level, String status);
}
