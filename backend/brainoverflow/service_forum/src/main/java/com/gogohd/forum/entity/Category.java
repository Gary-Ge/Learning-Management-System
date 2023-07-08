package com.gogohd.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("POST_CATEGORIES")
public class Category {
    private static final long serialVersionUID = 1L;

    @TableId(value = "category_id", type = IdType.ASSIGN_UUID)
    private String categoryId;

    private String courseId;

    private String name;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
