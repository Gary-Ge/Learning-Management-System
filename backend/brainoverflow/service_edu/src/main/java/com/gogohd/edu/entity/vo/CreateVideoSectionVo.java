package com.gogohd.edu.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CreateVideoSectionVo {
    @Schema(description = "The title of this video section", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "The description of this video section", requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

    @Schema(description = "The video cover of this video section, only need to be provided when this is a custom " +
            "video. A default cover will be applied if not provided.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String cover;

    @Schema(description = "The YouTube link of this video section, only need to be provided when this is a YouTube " +
            "video", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String youtubeLink;

    @Schema(description = "The video section type, 1 for YouTube video section, 2 for custom video section",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer type;
}
