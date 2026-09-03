package com.thlam.streaming.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoleName {

    VIEWER("viewer"),
    STREAMER("streamer"),
    ADMINISTRATOR("administrator");

    private final String code;
}
