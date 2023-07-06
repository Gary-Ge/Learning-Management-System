package com.gogohd.stream.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;

    private String streamId;

    private String message;

    private String userId;

    private String username;

    private String time;

    private String avatar;

    private String email;

    private Integer type = 0;
}
