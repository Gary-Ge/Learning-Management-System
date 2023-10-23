package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("COURSES")
public class Course {
    private static final long serialVersionUID = 2L;

    @TableId(value = "course_id", type = IdType.ASSIGN_UUID)
    private String courseId;

    private String title;

    private String categoryId;

    private String description;

    private String cover;

    private String createdBy;

    private String updatedBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private boolean hasForum;
}
