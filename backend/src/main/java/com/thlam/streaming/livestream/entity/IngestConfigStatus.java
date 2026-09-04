package com.thlam.streaming.livestream.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum IngestConfigStatus {

    ACTIVE("active"),
    REVOKED("revoked");

    private final String code;
}
