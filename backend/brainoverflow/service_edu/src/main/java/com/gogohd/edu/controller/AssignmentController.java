package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.service.AssignmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

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
}
