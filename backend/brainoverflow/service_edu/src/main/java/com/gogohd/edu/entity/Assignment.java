package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("ASSIGNMENTS")
public class Assignment {
    private static final long serialVersionUID = 10L;

    @TableId(value = "assignment_id", type = IdType.ASSIGN_UUID)
    private String assignmentId;

    private String courseId;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
