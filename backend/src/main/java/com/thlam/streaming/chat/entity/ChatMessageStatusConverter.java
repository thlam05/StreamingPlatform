package com.thlam.streaming.chat.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ChatMessageStatusConverter implements AttributeConverter<ChatMessageStatus, String> {

    @Override
    public String convertToDatabaseColumn(ChatMessageStatus status) {
        return status == null ? null : status.getCode();
    }

    @Override
    public ChatMessageStatus convertToEntityAttribute(String value) {
        if (value == null) {
            return null;
        }
        for (ChatMessageStatus status : ChatMessageStatus.values()) {
            if (status.getCode().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown chat message status: " + value);
    }
}
