package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateQuestionVo {
    @Schema(description = "The cover page of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private String cover;

    @Schema(description = "The description of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @Schema(description = "The question type, 0 is single choice, 1 is multi-choice, 2 is short-answer", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer type;

    @Schema(description = "The mark of this question", requiredMode = Schema.RequiredMode.REQUIRED)
    private Float mark;

    private String a;
    private String b;
    private String c;
    private String d;
    private String e;
    private String f;
    private int aCorrect;
    private int bCorrect;
    private int cCorrect;
    private int dCorrect;
    private int eCorrect;
    private int fCorrect;
    private String shortAnswer;
}
