package com.gogohd.edu.entity.vo;

import lombok.Data;

@Data
public class CreateQuestionVo {
    private String description;

    private String image;

    private Integer type;

    private String a;
    private String b;
    private String c;
    private String d;
    private String e;
    private String f;

    private String correct;
}
