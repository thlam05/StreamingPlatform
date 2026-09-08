package com.thlam.streaming.livestream.controller;

import com.thlam.streaming.common.dtos.ApiResponse;
import com.thlam.streaming.common.enums.ApiResponseCode;
import com.thlam.streaming.livestream.dto.response.CategoryResponse;
import com.thlam.streaming.livestream.service.CategoryService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> findActive() {
        return ResponseEntity.ok(new ApiResponse<>(
                categoryService.findActive(),
                ApiResponseCode.CATEGORIES_RETRIEVED.getCode(),
                "Active stream categories retrieved successfully"));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryResponse>> findActiveById(
            @PathVariable UUID categoryId) {
        return ResponseEntity.ok(new ApiResponse<>(
                categoryService.findActiveById(categoryId),
                ApiResponseCode.CATEGORY_RETRIEVED.getCode(),
                "Active stream category retrieved successfully"));
    }

    @GetMapping("/{parentId}/children")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> findActiveChildren(
            @PathVariable UUID parentId) {
        return ResponseEntity.ok(new ApiResponse<>(
                categoryService.findActiveChildren(parentId),
                ApiResponseCode.CATEGORIES_RETRIEVED.getCode(),
                "Active child stream categories retrieved successfully"));
    }
}
