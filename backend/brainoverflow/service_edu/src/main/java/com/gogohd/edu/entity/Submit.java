package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("SUBMITS")
public class Submit {
    private static final long serialVersionUID = 14L;

    @TableId(value = "submit_id", type = IdType.ASSIGN_UUID)
    private String submitId;

    private String assignmentId;

    private String name;

    private String source;

    private Float mark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    private String submittedBy;
}
