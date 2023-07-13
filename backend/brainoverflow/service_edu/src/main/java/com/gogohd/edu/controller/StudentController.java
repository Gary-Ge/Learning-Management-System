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

    @Operation(summary = "Download one submit")
    @GetMapping("submit/{submitId}")
    public R downloadSubmit(HttpServletRequest request, @PathVariable String submitId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Download submit success").data("fileUrl",
                studentService.downloadSubmitBySubmitId(userId, submitId));
    }

    @Operation(summary = "Submit a question")
    @PostMapping("submit/question/{questionId}")
    public R submitQuestion(HttpServletRequest request, @PathVariable String questionId,
                            @RequestParam(required = false) String optionIds,
                            @RequestParam(required = false) String content) {
        String userId = (String) request.getAttribute("userId");
        if (optionIds == null || optionIds.isEmpty()) {
            optionIds = "";
        }
        if (content == null || content.isEmpty()) {
            content = "";
        }
        studentService.submitQuestion(userId, questionId, optionIds, content);
        return R.success().message("Submit question success");
    }

    @Operation(summary = "Get all the streams start date this user is a student of")
    @GetMapping("streams/date")
    public R getEnrolledStreamListDateByUserId(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get enrolled live courses success").data("courses",
                studentService.getEnrolledStreamListDateByUserId(userId));
    }

    @Operation(summary = "Get all the course this user enrolled in with forum")
    @GetMapping("coursesWithForum")
    public R getEnrolledCourseWithForum(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get enrolled course with forum success").data("courses",
                studentService.getEnrolledCourseListWithForum(userId));
    }
}
