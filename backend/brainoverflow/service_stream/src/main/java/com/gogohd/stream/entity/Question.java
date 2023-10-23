package com.gogohd.stream.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("QUICK_QUIZ_QUESTIONS")
public class Question implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "question_id", type = IdType.ASSIGN_UUID)
    private String questionId;

    private String quizId;

    private Integer mark;

    private Integer type;

    private String question;

    private String optionA;

    private String optionB;

    private String optionC;

    private String optionD;

    private String answer;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    private Integer sort;
}
