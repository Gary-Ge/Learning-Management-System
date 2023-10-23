package com.gogohd.ucenter.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class VerifyCodeVo {
    @Schema(description = "Email address of user", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @Schema(description = "Verification code input by user", requiredMode = Schema.RequiredMode.REQUIRED)
    private String code;
}
