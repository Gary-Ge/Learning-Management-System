package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateTextSectionVo {
    @Schema(description = "Title of this section", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String title;

    @Schema(description = "Content of this section", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;
}
