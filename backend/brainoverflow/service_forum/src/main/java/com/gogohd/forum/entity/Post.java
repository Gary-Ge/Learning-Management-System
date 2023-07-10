package com.gogohd.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@TableName("POSTS")
public class Post {
    private static final long serialVersionUID = 1L;

    @TableId(value = "post_id", type = IdType.ASSIGN_UUID)
    private String postId;

    private String courseId;

    private String postBy;

    private String title;

    private String content;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private String categoryId;
}
