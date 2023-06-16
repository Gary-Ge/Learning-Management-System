package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("CATEGORIES")
public class Category {
    private static final long serialVersionUID = 3L;

    @TableId(value = "category_id", type = IdType.ASSIGN_UUID)
    private String categoryId;

    private String categoryName;

    private String createdBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
