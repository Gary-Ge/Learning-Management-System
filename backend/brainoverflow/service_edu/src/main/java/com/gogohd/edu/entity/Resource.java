package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("RESOURCES")
public class Resource {
    private static final long serialVersionUID = 6L;

    @TableId(value = "resource_id", type = IdType.ASSIGN_UUID)
    private String resourceId;

    private String title;

    private String source;

    private Integer type;

    private String createdBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    private String sectionId;
}
