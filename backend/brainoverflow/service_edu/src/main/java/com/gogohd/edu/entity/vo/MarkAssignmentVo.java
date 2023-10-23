package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MarkAssignmentVo {
    @Schema(description = "The mark of this student", requiredMode = Schema.RequiredMode.REQUIRED)
    private Float mark;
}
