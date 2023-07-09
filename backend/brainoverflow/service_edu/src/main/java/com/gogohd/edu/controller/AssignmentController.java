package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.entity.vo.MarkAssignmentVo;
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

    @Operation(summary = "Get a specific assignment information")
    @GetMapping("assignment/{assignmentId}")
    public R getAssignmentById(HttpServletRequest request, @PathVariable String assignmentId) {
        String userId = (String) request.getAttribute("userId");
        Map<String, Object> assignment = assignmentService.getAssignmentById(assignmentId, userId);
        return R.success().message("Get assignment success").data("assignment", assignment);
    }

    @Operation(summary = "Get a list of assignments of this course")
    @GetMapping("assignments/{courseId}")
    public R getAssignmentListByCourseId(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        List<Map<String, Object>> assignments = assignmentService.getAssignmentListByCourseId(userId, courseId);
        return R.success().message("Get assignment list success").data("assignments", assignments);
    }

    @Operation(summary = "Delete an assignment")
    @DeleteMapping("assignment/{assignmentId}")
    public R deleteAssignment(HttpServletRequest request, @PathVariable String assignmentId) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.deleteAssignment(userId, assignmentId);
        return R.success().message("Delete assignment success");
    }

    @Operation(summary = "Update an assignment")
    @PutMapping("assignment/{assignmentId}")
    public R updateAssignment(HttpServletRequest request, @PathVariable String assignmentId,
                              @RequestBody UpdateAssignmentVo updateAssignmentVo) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.updateAssignment(userId, assignmentId, updateAssignmentVo);
        return R.success().message("Update assignment success");
    }

    @Operation(summary = "Upload multiple files for an assignment")
    @PostMapping("assignment/assFile/{assignmentId}")
    public R uploadAssignment(HttpServletRequest request, @PathVariable String assignmentId, MultipartFile[] files) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.uploadAssignment(userId, assignmentId, files);
        return R.success().message("Upload assignment files success");
    }

    @Operation(summary = "Download an assignment file for this course")
    @GetMapping("assignment/assFile/{assFileId}")
    public R downloadAssignment(HttpServletRequest request, @PathVariable String assFileId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get download link success").data("fileUrl",
                assignmentService.downloadAssignment(userId, assFileId));
    }

    @Operation(summary = "Delete one assignment file")
    @DeleteMapping("assignment/assFile/{assFileId}")
    public R deleteAssignmentFile(HttpServletRequest request, @PathVariable String assFileId) {
        String userId = (String) request.getAttribute("userId");
        assignmentService.deleteAssignmentFile(userId, assFileId);
        return R.success().message("Delete assignment file success");
    }

    @Operation(summary = "Get all the submits of an assignment")
    @GetMapping("assignment/{assignmentId}/submits")
    public R getSubmits(HttpServletRequest request, @PathVariable String assignmentId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get submits files success").data("assignment",
                assignmentService.getSubmitsByAssignmentId(userId, assignmentId));
    }

    @Operation(summary = "Mark an assignment by staff")
    @PutMapping("assignment/{assignmentId}/mark/{userId}")
    public R markAssignment(HttpServletRequest request, @PathVariable String assignmentId,
                            @PathVariable String userId, @RequestBody MarkAssignmentVo markAssignmentVo) {
        String markerUserId = (String) request.getAttribute("userId");
        assignmentService.markAssignmentByStaffId(markerUserId, userId, assignmentId, markAssignmentVo);
        return R.success().message("Assignment marked successfully");
    }
}
