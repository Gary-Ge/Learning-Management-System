package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Student;

import java.util.List;
import java.util.Map;

public interface StudentService extends IService<Student> {

    void enrollCourse(String userId, String courseId);

    List<Map<String, Object>> getEnrolledCoursesByUserId(String userId);

    void dropCourse(String userId, String courseId);
}
