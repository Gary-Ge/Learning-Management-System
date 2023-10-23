package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateTextSectionVo {
    @Schema(description = "Title of this section", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "Content of this section", requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;
}
