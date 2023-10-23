package com.gogohd.stream.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class CreateQuizVo {
    @Schema(description = "The time limitation of this quiz, in seconds",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private Integer limitation;

    @Schema(description = "The questions of this quiz", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<CreateQuestionVo> questions;
}
