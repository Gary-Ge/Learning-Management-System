package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Assignment;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.entity.vo.UpdateAssignmentVo;

import java.util.List;
import java.util.Map;

public interface AssignmentService extends IService<Assignment> {
    String createAssignment(String userId, String courseId, CreateAssignmentVo createAssignmentVo);

    Map<String, Object> getAssignmentById(String assignmentId, String token);

    List<Map<String, Object>> getAssignmentListByCourseId(String userId, String courseId, String token);

    void deleteAssignment(String userId, String assignmentId);

    void updateAssignment(String userId, String assignmentId, UpdateAssignmentVo updateAssignmentVo);
}
