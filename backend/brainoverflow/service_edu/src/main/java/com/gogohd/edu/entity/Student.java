package com.gogohd.edu.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("STUDENTS")
public class Student {
    private static final long serialVersionUID = 7L;

    @TableId(value = "student_id", type = IdType.ASSIGN_UUID)
    private String studentId;

    private String userId;

    private String courseId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
