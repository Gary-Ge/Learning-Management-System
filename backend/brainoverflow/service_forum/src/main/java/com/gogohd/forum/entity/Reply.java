package com.gogohd.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("REPLIES")
public class Reply {
    private static final long serialVersionUID = 1L;

    @TableId(value = "reply_id", type = IdType.ASSIGN_UUID)
    private String replyId;

    private String postId;

    private String replyBy;

    private String parentId;

    private String content;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private String replyTo;
}
