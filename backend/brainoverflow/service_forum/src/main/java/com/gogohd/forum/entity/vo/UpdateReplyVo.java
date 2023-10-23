package com.gogohd.forum.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateReplyVo {
    @Schema(description = "The content of this reply", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String content;
}
