package com.gogohd.forum.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateCategoryVo {
    @Schema(description = "The name of this category", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String name;

    @Schema(description = "The color of this category", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String color;
}
