package com.thlam.streaming.livestream.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StreamStatusConverter implements AttributeConverter<StreamStatus, String> {

    @Override
    public String convertToDatabaseColumn(StreamStatus status) {
        return status == null ? null : status.getCode();
    }

    @Override
    public StreamStatus convertToEntityAttribute(String value) {
        return value == null ? null : StreamStatus.fromCode(value);
    }
}
