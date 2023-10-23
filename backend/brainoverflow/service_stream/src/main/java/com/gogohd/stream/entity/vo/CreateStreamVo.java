package com.gogohd.stream.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateStreamVo {
    @Schema(description = "The title of this stream lesson", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "The description of this stream lesson", requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

    @Schema(description = "The start date and time of this stream lesson", requiredMode = Schema.RequiredMode.REQUIRED)
    private String start;

    @Schema(description = "The end date and time of this stream lesson", requiredMode = Schema.RequiredMode.REQUIRED)
    private String end;
}
