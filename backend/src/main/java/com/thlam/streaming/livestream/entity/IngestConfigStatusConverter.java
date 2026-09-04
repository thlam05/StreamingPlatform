package com.thlam.streaming.livestream.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class IngestConfigStatusConverter implements AttributeConverter<IngestConfigStatus, String> {

    @Override
    public String convertToDatabaseColumn(IngestConfigStatus status) {
        return status == null ? null : status.getCode();
    }

    @Override
    public IngestConfigStatus convertToEntityAttribute(String value) {
        if (value == null) {
            return null;
        }
        return IngestConfigStatus.valueOf(value.toUpperCase());
    }
}
