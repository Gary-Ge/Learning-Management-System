package com.gogohd.stream.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class UserList implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer type = 1;

    private String streamId;

    private List<Map<String, Object>> userList;
}
