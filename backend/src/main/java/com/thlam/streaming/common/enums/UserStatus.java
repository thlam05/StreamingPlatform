package com.thlam.streaming.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {

    ACTIVE("active"),
    SUSPENDED("suspended"),
    DELETED("deleted");

    private final String code;
}
