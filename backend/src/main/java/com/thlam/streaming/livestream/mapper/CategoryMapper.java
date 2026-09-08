package com.thlam.streaming.livestream.mapper;

import com.thlam.streaming.livestream.dto.response.CategoryResponse;
import com.thlam.streaming.livestream.entity.Category;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getParentId(),
                category.getName(),
                category.getSlug(),
                category.getLevel(),
                category.getStatus(),
                List.of());
    }

    public CategoryResponse toResponse(Category category, List<CategoryResponse> children) {
        return new CategoryResponse(
                category.getId(),
                category.getParentId(),
                category.getName(),
                category.getSlug(),
                category.getLevel(),
                category.getStatus(),
                children);
    }
}
