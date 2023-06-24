package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("ASSFILES")
public class AssFiles {
    private static final long serialVersionUID = 13L;

    @TableId(value = "file_id", type = IdType.ASSIGN_UUID)
    private String fileId;

    private String assignmentId;

    private String title;

    private String source;

    private Integer type;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
