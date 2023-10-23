package com.gogohd.stream.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class AnswerDistributionMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer type = 3;

    private String streamId;

    private String quizId;

    private List<Map<String, Object>> questions;
}
