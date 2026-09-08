package com.thlam.streaming.common.utils;

public final class ConfigurationUtils {

    private ConfigurationUtils() {
    }

    public static String requireProperty(String value, String name) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(name + " must be configured");
        }
        return value;
    }
}
