package com.gogohd.stream.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class AnswerQuizVo {
    @Schema(description = "The answers of student", requiredMode = Schema.RequiredMode.REQUIRED)
    List<String> answers;
}
