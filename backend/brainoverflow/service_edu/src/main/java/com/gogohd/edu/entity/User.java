package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("USERS")
public class User {
    private static final long serialVersionUID = 17L;

    @TableId(value = "user_id", type = IdType.ASSIGN_UUID)
    private String userId;

    private String username;

    private String password;

    private String email;

    private String avatar;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime updatedAt;
}
