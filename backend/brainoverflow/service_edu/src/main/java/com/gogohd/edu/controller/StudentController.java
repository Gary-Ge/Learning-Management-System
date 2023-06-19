package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
