package com.thlam.streaming.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApiErrorCode {

    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND"),
    CONFLICT("CONFLICT"),
    VALIDATION_ERROR("VALIDATION_ERROR"),
    INVALID_REQUEST("INVALID_REQUEST"),
    DATA_INTEGRITY_VIOLATION("DATA_INTEGRITY_VIOLATION"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR");

    private final String code;
}
