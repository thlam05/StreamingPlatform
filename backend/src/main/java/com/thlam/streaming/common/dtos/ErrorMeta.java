package com.thlam.streaming.common.dtos;

import java.util.Map;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMeta {

    private Instant timestamp;
    private int status;
    private String path;
    private Map<String, String> fieldErrors;
}
