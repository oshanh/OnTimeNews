package org.oshanh.newsweb.dto;

import java.util.List;

public record CreateNewsRequest(
        String title,
        String summary,
        String content,
        String imageUrl,
        String publishedAt,
        List<Long> categoryIds
) {
}
