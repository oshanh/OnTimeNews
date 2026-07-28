package org.oshanh.newsweb.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(

        @NotBlank(message = "Author name is required")
        @Size(max = 120, message = "Author name must be 120 characters or less")
        String authorName,

        @NotBlank(message = "Comment message is required")
        @Size(max = 1000, message = "Comment message must be 1000 characters or less")
        String message
) {
}