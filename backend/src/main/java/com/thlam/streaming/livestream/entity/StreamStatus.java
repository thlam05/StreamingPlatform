package com.thlam.streaming.livestream.entity;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StreamStatus {

    SCHEDULED("scheduled"),
    LIVE("live"),
    ENDED("ended"),
    CANCELLED("cancelled");

    private final String code;

    public static StreamStatus fromCode(String code) {
        return Arrays.stream(values())
                .filter(status -> status.code.equalsIgnoreCase(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown stream status: " + code));
    }
}
