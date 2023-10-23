package com.gogohd.forum.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdatePostVo {
    @Schema(description = "The category id of the post's category", requiredMode = Schema.RequiredMode.REQUIRED)
    private String categoryId;

    @Schema(description = "The title of this post", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String title;

    @Schema(description = "The content of this post", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String content;
}
