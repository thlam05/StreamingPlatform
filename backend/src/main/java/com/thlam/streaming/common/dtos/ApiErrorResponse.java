package com.thlam.streaming.common.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public final class ApiErrorResponse<T> extends ApiResponse<T> {

    private ErrorMeta meta;

    public ApiErrorResponse(String code, String message, ErrorMeta meta) {
        super(null, code, message);
        this.meta = meta;
    }
}
