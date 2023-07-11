package com.gogohd.stream.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

@Data
public class CreateQuestionVo implements Serializable {
    @Schema(description = "The mark of this question", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private Integer mark;

    @Schema(description = "The type of this question, 0 for single choice, 1 for multi choice",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer type;

    @Schema(description = "The question content of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private String question;

    @Schema(description = "The option A of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private String optionA;

    @Schema(description = "The option B of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private String optionB;

    @Schema(description = "The option C of this question", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String optionC;

    @Schema(description = "The option D of this question", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String optionD;

    @Schema(description = "The answer of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private String answer;
}
