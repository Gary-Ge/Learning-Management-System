package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CreateAssignmentVo {
    @Schema(description = "The title of this assignment", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "The description of this assignment", requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

    @Schema(description = "The start time of this assignment", requiredMode = Schema.RequiredMode.REQUIRED)
    private String start;

    @Schema(description = "The end time of this assignment", requiredMode = Schema.RequiredMode.REQUIRED)
    private String end;

    @Schema(description = "The mark of this assignment", requiredMode = Schema.RequiredMode.REQUIRED)
    private Float mark;
}
