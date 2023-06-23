package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.entity.vo.UpdateAssignmentVo;
import com.gogohd.edu.service.AssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("edu-assignment")
@Tag(name = "Assignment related APIs")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;

    @Operation(summary = "Create an assignment for a course")
    @PostMapping("assignment/{courseId}")
    public R createAssignment(HttpServletRequest request, @PathVariable String courseId,
                              @RequestBody CreateAssignmentVo createAssignmentVo) {
        String userId = (String) request.getAttribute("userId");
        String assignmentId = assignmentService.createAssignment(userId, courseId, createAssignmentVo);
        return R.success().message("Create assignment success").data("assignmentId", assignmentId);
    }

    @Operation(summary = "Get a specific assignment for this course")
    @GetMapping("assignment/{assignmentId}")
    public R getAssignmentById(HttpServletRequest request, @PathVariable String assignmentId) {
        String token = request.getHeader("token");
        Map<String, Object> assignment = assignmentService.getAssignmentById(assignmentId, token);
        return R.success().message("Get assignment success").data("assignment", assignment);
    }

    @Operation(summary = "Get a list of assignments for this course")
    @GetMapping("assignments/{courseId}")
    public R getAssignmentListByCourseId(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        String token = request.getHeader("token");
        List<Map<String, Object>> assignments = assignmentService.getAssignmentListByCourseId(userId, courseId, token);
        return R.success().message("Get assignment list success").data("assignments", assignments);
    }

    @Operation(summary = "Delete an assignment for this course")
    @DeleteMapping("assignment/{assignmentId}")
    public R deleteAssignment(HttpServletRequest request, @PathVariable String assignmentId) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.deleteAssignment(userId, assignmentId);
        return R.success().message("Delete assignment success");
    }

    @Operation(summary = "Update an assignment for this course")
    @PutMapping("assignment/{assignmentId}")
    public R updateAssignment(HttpServletRequest request, @PathVariable String assignmentId,
                              @RequestBody UpdateAssignmentVo updateAssignmentVo) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.updateAssignment(userId, assignmentId, updateAssignmentVo);
        return R.success().message("Update assignment success");
    }

    @Operation(summary = "Upload assignment files for this course")
    @PostMapping("assignment/upload/{assignmentId}")
    public R uploadAssignment(HttpServletRequest request, @PathVariable String assignmentId, MultipartFile[] files) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.uploadAssignment(userId, assignmentId, files);
        return R.success().message("Upload assignment success");
    }

    @Operation(summary = "Download assignment files for this course")
    @GetMapping("assignment/download/{assignmentId}/{fileId}")
    public void downloadAssignment(HttpServletRequest request, HttpServletResponse response,
                                @PathVariable String assignmentId,
                                @PathVariable String fileId) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.downloadAssignment(userId, response, assignmentId, fileId);
    }
}
