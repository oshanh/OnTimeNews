package org.oshanh.newsweb.dto;

import java.time.LocalDateTime;
import java.util.List;

public record NewsHeadlineDto(
        Long id,
        String title,
        String summary,
        LocalDateTime publishedAt,
        List<String> categories
) {
}