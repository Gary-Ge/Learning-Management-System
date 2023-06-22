package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("SECTIONS")
public class Section {
    private static final long serialVersionUID = 5L;

    @TableId(value = "section_id", type = IdType.ASSIGN_UUID)
    private String sectionId;

    private String title;

    private String description;

    private String cover;

    private Integer type;

    private String createdBy;

    private String updatedBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private String youtubeLink;

    private String courseId;
}
