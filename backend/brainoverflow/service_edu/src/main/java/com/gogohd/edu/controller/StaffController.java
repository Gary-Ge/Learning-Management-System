package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("edu-staff")
@Tag(name = "Staff related APIs")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Operation(summary = "Get all the courses this user is a staff of")
    @GetMapping("courses")
    public R getStaffedCourses(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get staffed courses information success").data("courses",
                staffService.getStaffedCourseListByUserId(userId));
    }

    @Operation(summary = "Get all the streams start date this user is a staff of")
    @GetMapping("streams/date")
    public R getEnrolledStreamListDateByUserId(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get teach live courses success").data("courses",
                staffService.getStaffedStreamListDateByUserId(userId));
    }

    @Operation(summary = "Get all the courses this user is a staff of and with forum")
    @GetMapping("coursesWithForum")
    public R getStaffedCoursesWithForum(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get staffed courses with forum information success").data("courses",
                staffService.getStaffedCourseListWithForumByUserId(userId));
    }
}
