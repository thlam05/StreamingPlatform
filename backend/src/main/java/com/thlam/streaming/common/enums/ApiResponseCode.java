package com.thlam.streaming.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApiResponseCode {

    USER_REGISTERED("USER_REGISTERED"),
    LOGIN_SUCCESS("LOGIN_SUCCESS"),
    USER_PROFILE("USER_PROFILE"),
    PROFILE_UPDATED("PROFILE_UPDATED"),
    PASSWORD_UPDATED("PASSWORD_UPDATED"),
    ROLES_RETRIEVED("ROLES_RETRIEVED"),
    PERMISSIONS_RETRIEVED("PERMISSIONS_RETRIEVED"),
    USER_ROLES_RETRIEVED("USER_ROLES_RETRIEVED"),
    USER_ROLE_ASSIGNED("USER_ROLE_ASSIGNED"),
    USER_ROLE_REMOVED("USER_ROLE_REMOVED");

    private final String code;
}
