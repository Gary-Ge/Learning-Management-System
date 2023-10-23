package com.gogohd.chat.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class SendMessageVo {
    @Schema(description = "The message to be sent to the chat bot", requiredMode = Schema.RequiredMode.REQUIRED)
    private String message;
}
