package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("edu-student")
@Tag(name = "Student related APIs")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Operation(summary = "Join a course")
    @GetMapping("student/{courseId}")
    public R enrollCourse(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        studentService.enrollCourse(userId, courseId);
        return R.success().message("Enroll course success");
    }

    @Operation(summary = "Drop a course")
    @DeleteMapping("student/{courseId}")
    public R dropCourse(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        studentService.dropCourse(userId, courseId);
        return R.success().message("Drop course success");
    }

    @Operation(summary = "Get all the courses this user have enrolled in")
    @GetMapping("courses")
    public R getEnrolledCourses(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get enrolled courses information success").data("courses",
                studentService.getEnrolledCoursesByUserId(userId));
    }

    @Operation(summary = "Submit Assignment")
    @PostMapping("submit/{assignmentId}")
    public R submitAssignment(HttpServletRequest request, @PathVariable String assignmentId, MultipartFile[] files) {
        String userId = (String) request.getAttribute("userId");
        studentService.submitAssignment(userId, assignmentId, files);
        return R.success().message("Upload assignment success");
    }

    @Operation(summary = "Get one assignment info with submit info")
    @GetMapping("assignment/{assignmentId}")
    public R getAssignment(HttpServletRequest request, @PathVariable String assignmentId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get assignment info success").data("assignment",
                studentService.getAssignmentById(userId, assignmentId));
    }

    @Operation(summary = "Get all the assignments info with submit info of a course")
    @GetMapping("assignments/{courseId}")
    public R getAssignmentList(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get assignments info success").data("assignments",
                studentService.getAssignmentListByCourseId(userId, courseId));
    }
}
