package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("ANSWERS")
public class Answer {
    private static final long serialVersionUID = 14L;

    @TableId(value = "answer_id", type = IdType.ASSIGN_UUID)
    private String answerId;

    private String studentId;

    private String questionId;

    private String optionIds;

    private String content;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private Float mark;
}
