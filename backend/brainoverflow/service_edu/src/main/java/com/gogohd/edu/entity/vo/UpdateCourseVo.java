package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateCourseVo {
    @Schema(description = "The new title of this course", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String title;

    @Schema(description = "The category of this course", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String category;

    @Schema(description = "The description or outline of this course", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;

    @Schema(description = "The cover or thumbnail of the course, a default cover will be applied if not provided",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String cover;

    @Schema(description = "If this course has a forum", requiredMode = Schema.RequiredMode.REQUIRED)
    private boolean hasForum;
}
