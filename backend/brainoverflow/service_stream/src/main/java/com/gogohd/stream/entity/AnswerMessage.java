package com.gogohd.stream.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class AnswerMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private String streamId;

    private String quizId;
}
