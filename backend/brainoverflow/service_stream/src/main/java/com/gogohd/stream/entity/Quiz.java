package com.gogohd.stream.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("QUICK_QUIZZES")
public class Quiz {
    private static final long serialVersionUID = 1L;

    @TableId(value = "quiz_id", type = IdType.ASSIGN_UUID)
    private String quizId;

    private Integer limitation;

    private String streamId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
