package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Student;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface StudentService extends IService<Student> {

    void enrollCourse(String userId, String courseId);

    List<Map<String, Object>> getEnrolledCoursesByUserId(String userId);

    void dropCourse(String userId, String courseId);

    void submitAssignment(String userId, String courseId, MultipartFile[] files);

    Map<String, Object> getAssignmentById(String userId, String assignmentId);

    List<Map<String, Object>> getAssignmentListByCourseId(String userId, String courseId);

    Object downloadSubmitBySubmitId(String userId, String submitId);

//    void submitQuiz(String userId, String quizId, Map<String, String> answers);

    void submitQuestion(String userId, String questionId, String optionIds, String content);

    Object getEnrolledStreamListDateByUserId(String userId);

    Object getEnrolledCourseListWithForum(String userId);

    Object getDueDateListByUserId(String userId);
}
