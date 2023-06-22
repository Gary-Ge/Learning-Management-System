package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("QUIZZES")
public class Quiz {
    private static final long serialVersionUID = 11L;

    @TableId(value = "quiz_id", type = IdType.ASSIGN_UUID)
    private String quizId;

    private String courseId;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    private Integer limitation;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
