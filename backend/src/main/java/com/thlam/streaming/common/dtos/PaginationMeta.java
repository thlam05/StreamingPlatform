package com.thlam.streaming.common.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaginationMeta {

    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
