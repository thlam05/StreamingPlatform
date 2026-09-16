package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.ResourceNotFoundException;
import com.thlam.streaming.livestream.dto.response.CategoryResponse;
import com.thlam.streaming.livestream.entity.Category;
import com.thlam.streaming.livestream.mapper.CategoryMapper;
import com.thlam.streaming.livestream.repository.CategoryRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private static final String ACTIVE = "active";
    private static final Short TOP_LEVEL = (short) 1;
    private static final Short CHILD_LEVEL = (short) 2;

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> findActive() {
        List<Category> categories = categoryRepository.findAllByStatusOrderByLevelAscNameAsc(ACTIVE);
        Map<UUID, List<CategoryResponse>> childrenByParent = categories.stream()
                .filter(category -> CHILD_LEVEL.equals(category.getLevel()) && category.getParentId() != null)
                .collect(Collectors.groupingBy(
                        Category::getParentId,
                        Collectors.mapping(categoryMapper::toResponse, Collectors.toList())));

        return categories.stream()
                .filter(category -> TOP_LEVEL.equals(category.getLevel()))
                .map(category -> categoryMapper.toResponse(
                        category,
                        childrenByParent.getOrDefault(category.getId(), List.of())))
                .toList();
    }

    @Override
    public CategoryResponse findActiveById(UUID categoryId) {
        return categoryRepository.findByIdAndStatus(categoryId, ACTIVE)
                .map(categoryMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Active category not found"));
    }

    @Override
    public List<CategoryResponse> findActiveChildren(UUID parentId) {
        Category parent = categoryRepository.findByIdAndStatus(parentId, ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Active parent category not found"));
        if (!TOP_LEVEL.equals(parent.getLevel())) {
            throw new ResourceNotFoundException("Category is not a top-level category");
        }
        return categoryRepository.findAllByParentIdAndLevelAndStatusOrderByNameAsc(
                        parentId, CHILD_LEVEL, ACTIVE).stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    public boolean existsActiveLevelTwo(UUID categoryId) {
        return categoryRepository.existsByIdAndLevelAndStatus(categoryId, CHILD_LEVEL, ACTIVE);
    }
}
