package org.oshanh.newsweb.dto;

import java.time.LocalDateTime;
import java.util.List;

public record NewsDetailDto(
        Long id,
        String title,
        String summary,
        String content,
        String imageUrl,
        LocalDateTime publishedAt,
        List<String> categories
) {
}