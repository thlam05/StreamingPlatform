package com.thlam.streaming.user.entity;

import com.thlam.streaming.common.enums.UserStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Locale;

@Converter
public class UserStatusConverter implements AttributeConverter<UserStatus, String> {

    @Override
    public String convertToDatabaseColumn(UserStatus status) {
        return status == null ? null : status.getCode();
    }

    @Override
    public UserStatus convertToEntityAttribute(String status) {
        if (status == null) {
            return null;
        }
        return UserStatus.valueOf(status.toUpperCase(Locale.ROOT));
    }
}
