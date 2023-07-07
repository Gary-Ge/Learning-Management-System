package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CreateQuizVo {
    @Schema(description = "The title of this quiz", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

//    @Schema(description = "The description of this quiz", requiredMode = Schema.RequiredMode.REQUIRED)
//    private String description;

    @Schema(description = "The attempt time of this quiz", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer limitation;

    @Schema(description = "The start time of this quiz", requiredMode = Schema.RequiredMode.REQUIRED)
    private String start;

    @Schema(description = "The end time of this quiz", requiredMode = Schema.RequiredMode.REQUIRED)
    private String end;
}
