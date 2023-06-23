package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.entity.vo.UpdateAssignmentVo;
import com.gogohd.edu.service.AssignmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("edu-assignment")
@Tag(name = "Assignment related APIs")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;

    @PostMapping("assignment/{courseId}")
    public R createAssignment(HttpServletRequest request, @PathVariable String courseId,
                              @RequestBody CreateAssignmentVo createAssignmentVo) {
        String userId = (String) request.getAttribute("userId");
        String assignmentId = assignmentService.createAssignment(userId, courseId, createAssignmentVo);
        return R.success().message("Create assignment success").data("assignmentId", assignmentId);
    }

    @GetMapping("assignment/{assignmentId}")
    public R getAssignmentById(HttpServletRequest request, @PathVariable String assignmentId) {
        String token = request.getHeader("token");
        Map<String, Object> assignment = assignmentService.getAssignmentById(assignmentId, token);
        return R.success().message("Get assignment success").data("assignment", assignment);
    }

    @GetMapping("assignments/{courseId}")
    public R getAssignmentListByCourseId(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        String token = request.getHeader("token");
        List<Map<String, Object>> assignments = assignmentService.getAssignmentListByCourseId(userId, courseId, token);
        return R.success().message("Get assignment list success").data("assignments", assignments);
    }

    @DeleteMapping("assignment/{assignmentId}")
    public R deleteAssignment(HttpServletRequest request, @PathVariable String assignmentId) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.deleteAssignment(userId, assignmentId);
        return R.success().message("Delete assignment success");
    }

    @PutMapping("assignment/{assignmentId}")
    public R updateAssignment(HttpServletRequest request, @PathVariable String assignmentId,
                              @RequestBody UpdateAssignmentVo updateAssignmentVo) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.updateAssignment(userId, assignmentId, updateAssignmentVo);
        return R.success().message("Update assignment success");
    }
}
