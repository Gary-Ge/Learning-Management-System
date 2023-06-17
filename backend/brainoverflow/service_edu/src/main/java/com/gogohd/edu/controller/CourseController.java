package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateCourseVo;
import com.gogohd.edu.entity.vo.UpdateCourseVo;
import com.gogohd.edu.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("edu-course")
@Tag(name = "Course related APIs")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Operation(summary = "Create a new course")
    @PostMapping("course")
    public R createCourse(HttpServletRequest request, @RequestBody CreateCourseVo createCourseVo) {
        String userId = (String) request.getAttribute("userId");
        String courseId = courseService.createCourse(userId, createCourseVo);
        return R.success().message("Create course success").data("courseId", courseId);
    }

    @Operation(summary = "Get the course information, including title, description, category, cover, forum and creator")
    @GetMapping("course/{courseId}")
    public R getCourse(HttpServletRequest request, @PathVariable String courseId) {
        String token = request.getHeader("Authorization");
        return R.success().message("Get course information success").data("course",
                courseService.getCourseById(courseId, token));
    }

    @Operation(summary = "Update the course information, the \"hasForum\" parameter is strictly required")
    @PutMapping("course/{courseId}")
    public R updateCourse(HttpServletRequest request, @PathVariable String courseId,
                          @RequestBody UpdateCourseVo updateCourseVo) {
        String userId = (String) request.getAttribute("userId");
        courseService.updateCourseById(userId, courseId, updateCourseVo);
        return R.success().message("Update course information success");
    }

    @Operation(summary = "Get a list of all the staffs of this course")
    @GetMapping("course/{courseId}/staff")
    public R getStaffList(HttpServletRequest request, @PathVariable String courseId) {
        String token = request.getHeader("Authorization");
        return R.success().message("Get staffs information success").data("staffs",
                courseService.getStaffListByCourseId(courseId, token));
    }

    @Operation(summary = "Upload a course cover")
    @PostMapping("course/{courseId}/cover")
    public R uploadCover(HttpServletRequest request, @PathVariable String courseId, MultipartFile file) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Upload cover success").data("cover",
                courseService.uploadCover(userId, courseId, file));
    }
}
