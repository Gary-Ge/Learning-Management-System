package com.gogohd.ucenter.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RegisterVo {
    @Schema(description = "User's username", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @Schema(description = "User's password, should be at least 8 characters, with 1 uppercase letter, one lowercase " +
            "letter and one number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    @Schema(description = "User's email address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
}
