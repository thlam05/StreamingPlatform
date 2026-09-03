package com.thlam.streaming.common.exception;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String message,
        String path,
        Map<String, String> fieldErrors) {
}
