package com.gogohd.ucenter.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateVo {
    @Schema(description = "User's username", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String username;

    @Schema(description = "User's password, should be at least 8 characters, with 1 uppercase letter, one lowercase " +
            "letter and one number", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String password;

    @Schema(description = "User's email address", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String email;

    @Schema(description = "User's avatar link", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String avatar;
}
