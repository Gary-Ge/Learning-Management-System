package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("QUESTIONS")
public class Question {
    private static final long serialVersionUID = 12L;

    @TableId(value = "question_id", type = IdType.ASSIGN_UUID)
    private String questionId;

    private String quizId;

    private String cover;

    private Integer type;

    private Integer mark;

    private String content;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private String a;
    private String b;
    private String c;
    private String d;
    private String e;
    private String f;
    private int aCorrect;
    private int bCorrect;
    private int cCorrect;
    private int dCorrect;
    private int eCorrect;
    private int fCorrect;
    private String shortAnswer;
}
