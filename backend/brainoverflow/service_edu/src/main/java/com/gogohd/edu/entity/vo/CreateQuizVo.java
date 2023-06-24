package com.gogohd.edu.entity.vo;

import lombok.Data;

@Data
public class CreateQuizVo {
    private String title;

    private String description;

    private String start;

    private String end;

    private Integer limitation;
}
