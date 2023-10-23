package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("STAFFS")
public class Staff {
    private static final long serialVersionUID = 4L;

    @TableId(value = "staff_id", type = IdType.ASSIGN_UUID)
    private String staffId;

    private String userId;

    private String courseId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
