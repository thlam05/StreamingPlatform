package com.thlam.streaming.common.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public final class ApiPaginationResponse<T> extends ApiResponse<T> {

    private PaginationMeta meta;

    public ApiPaginationResponse(T data, String code, String message, PaginationMeta meta) {
        super(data, code, message);
        this.meta = meta;
    }
}
