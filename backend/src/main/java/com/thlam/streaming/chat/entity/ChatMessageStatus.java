package com.thlam.streaming.chat.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ChatMessageStatus {
    PENDING("pending"),
    VISIBLE("visible"),
    HIDDEN("hidden"),
    BLOCKED("blocked"),
    FLAGGED("flagged");

    private final String code;
}
