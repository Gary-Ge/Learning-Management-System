package com.gogohd.stream.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AnswerVo {
    @Schema(description = "The question id of the question to be answered", requiredMode = Schema.RequiredMode.REQUIRED)
    private String questionId;

    @Schema(description = "The student answer of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private String answer;
}
