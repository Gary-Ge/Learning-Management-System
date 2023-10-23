package com.gogohd.forum.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CreateReplyVo {
    @Schema(description = "The content of this reply", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
}
