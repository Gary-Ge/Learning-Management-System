package com.gogohd.stream.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("STREAMS")
public class Stream {
    private static final long serialVersionUID = 1L;

    @TableId(value = "stream_id", type = IdType.ASSIGN_UUID)
    private String streamId;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    private String createdBy;

    private String updatedBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private String courseId;
}
