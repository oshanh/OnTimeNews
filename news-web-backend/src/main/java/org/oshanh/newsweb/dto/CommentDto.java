package org.oshanh.newsweb.dto;

import java.time.LocalDateTime;

public record CommentDto(
        Long id,
        String authorName,
        String message,
        LocalDateTime createdAt
) {
}