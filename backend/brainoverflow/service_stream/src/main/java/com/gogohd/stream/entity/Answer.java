package com.gogohd.stream.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("QUICK_QUIZ_ANSWERS")
public class Answer {
    private static final long serialVersionUID = 1L;

    @TableId(value = "answer_id", type = IdType.ASSIGN_UUID)
    private String answerId;

    private String quizId;

    private String answerBy;

    private String answers;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
