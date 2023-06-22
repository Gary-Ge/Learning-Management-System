package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Course;
import com.gogohd.edu.entity.vo.CreateCourseVo;
import com.gogohd.edu.entity.vo.UpdateCourseVo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CourseService extends IService<Course> {
    String createCourse(String userId, CreateCourseVo createCourseVo);

    Map<String, Object> getCourseById(String courseId, String token);

    Object getStaffListByCourseId(String courseId, String token);

    void updateCourseById(String userId, String courseId, UpdateCourseVo updateCourseVo);

    String uploadCover(String userId, MultipartFile file);

    Object getStudentListByCourseId(String courseId, String token);
}
