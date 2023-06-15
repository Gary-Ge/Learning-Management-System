package com.gogohd.ucenter.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdatePasswordVo {

    @Schema(description = "User's email address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @Schema(description = "User's new password", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;
}
