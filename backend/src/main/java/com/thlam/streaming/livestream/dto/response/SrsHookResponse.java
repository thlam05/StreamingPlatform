package com.thlam.streaming.livestream.dto.response;

public record SrsHookResponse(int code, String msg) {

    public static SrsHookResponse accepted() {
        return new SrsHookResponse(0, "OK");
    }

    public static SrsHookResponse rejected() {
        return new SrsHookResponse(1, "Callback rejected");
    }
}
