package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Assignment;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;

public interface AssignmentService extends IService<Assignment> {
    String createAssignment(String userId, String courseId, CreateAssignmentVo createAssignmentVo);
}
