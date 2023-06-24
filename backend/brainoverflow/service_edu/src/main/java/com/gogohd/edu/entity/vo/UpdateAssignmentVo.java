package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateAssignmentVo {
    @Schema(description = "The title of this assignment", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String title;

    @Schema(description = "The description of this assignment", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;

    @Schema(description = "The start time of this assignment", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String start;

    @Schema(description = "The end time of this assignment", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String end;
}
