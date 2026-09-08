package com.thlam.streaming.livestream.service;

import com.thlam.streaming.livestream.dto.response.CategoryResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

public interface CategoryService {

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    List<CategoryResponse> findActive();

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    CategoryResponse findActiveById(UUID categoryId);

    @PreAuthorize("hasAuthority('PERM_stream:read')")
    List<CategoryResponse> findActiveChildren(UUID parentId);

    boolean existsActiveLevelTwo(UUID categoryId);
}
