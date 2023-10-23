package com.gogohd.stream.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class QuizMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer type = 2;

    private String streamId;

    private String quizId;

    private Integer limitation;

    private List<Question> questions;
}
