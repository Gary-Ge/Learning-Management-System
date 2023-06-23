package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.OssUtils;
import com.gogohd.base.utils.RandomUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.mapper.*;
import com.gogohd.edu.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements StudentService {
    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    AssignmentMapper assignmentMapper;

    @Autowired
    SubmitMapper submitMapper;

    @Override
    public void enrollCourse(String userId, String courseId) {
        // Check if this course exists
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }

        // Check if this user has already enrolled in this course
        LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
        studentWrapper.eq(Student::getUserId, userId);
        studentWrapper.eq(Student::getCourseId, courseId);
        if (baseMapper.exists(studentWrapper)) {
            throw new BrainException(ResultCode.ERROR, "You have already enrolled in this course");
        }

        // Check if this user is a staff of this course
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (staffMapper.exists(staffWrapper)) {
            throw new BrainException(ResultCode.ERROR, "You cannot enroll in a course that you are a staff of");
        }

        // Enroll this user in this course
        Student student = new Student();
        student.setUserId(userId);
        student.setCourseId(courseId);
        if (!save(student)) {
            throw new BrainException(ResultCode.ERROR, "Enroll course failed");
        }
    }

    @Override
    public void dropCourse(String userId, String courseId) {
        // Check if this course exists
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course not exist");
        }

        // Check if this user has already enrolled in this course
        LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
        studentWrapper.eq(Student::getUserId, userId);
        studentWrapper.eq(Student::getCourseId, courseId);
        if (!baseMapper.exists(studentWrapper)) {
            throw new BrainException(ResultCode.ERROR, "You cannot drop from a course you have not enrolled in");
        }

        // Delete this student
        if (baseMapper.delete(studentWrapper) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete course failed");
        }
    }

    @Override
    public List<Map<String, Object>> getEnrolledCoursesByUserId(String userId) {
        return baseMapper.selectCoursesWithCreators(userId).stream()
                .map(record -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("courseId", record.get("course_id"));
                    map.put("title", record.get("title"));
                    map.put("description", record.get("description"));
                    map.put("cover", record.get("cover"));
                    map.put("hasForum", record.get("has_forum"));
                    map.put("category", record.get("category_name"));
                    map.put("createdAt", record.get("created_at"));
                    map.put("updatedAt", record.get("updated_at"));

                    Map<String, Object> creator = new HashMap<>();
                    creator.put("userId", record.get("user_id"));
                    creator.put("email", record.get("email"));
                    creator.put("avatar", record.get("avatar"));
                    creator.put("username", record.get("username"));

                    map.put("creator", creator);
                    return map;
                }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getLikeCourseByCourseName(String courseName) {
        return courseMapper.selectCoursesByName(courseName).stream()
                .map(record -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("courseId", record.get("course_id"));
                    map.put("title", record.get("title"));
                    map.put("description", record.get("description"));
                    map.put("cover", record.get("cover"));
                    map.put("hasForum", record.get("has_forum"));
                    map.put("category", record.get("category_name"));
                    map.put("createdAt", record.get("created_at"));
                    map.put("updatedAt", record.get("updated_at"));

                    Map<String, Object> creator = new HashMap<>();
                    creator.put("userId", record.get("user_id"));
                    creator.put("email", record.get("email"));
                    creator.put("avatar", record.get("avatar"));
                    creator.put("username", record.get("username"));

                    map.put("creator", creator);
                    return map;
                }).collect(Collectors.toList());
    }

    public boolean isStudentEnrolledInCourse(String userId, String courseId) {
        // Return true if there is a record matching the userId and courseId, otherwise return false
        return baseMapper.countByUserIdAndCourseId(userId, courseId) > 0;
    }

    @Override
    @Transactional
    public void submitAssignment(String userId, String assignmentId, MultipartFile[] files) {
        if (files == null) {
            throw new BrainException(ResultCode.ERROR, "No files");
        }

        // Check if this assignment exists
        Assignment assignment = assignmentMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment not exist");
        }

        // Assuming we have a function to check if a user is enrolled in the course of the assignment
        if (!isStudentEnrolledInCourse(userId, assignment.getCourseId())) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You are not enrolled in this course");
        }

        // Upload files
        for (MultipartFile file: files) {
            String filename = file.getOriginalFilename();
            if (filename == null) {
                throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be null");
            }

            // Generate a UUID for each file and use the UUID as filename, preventing file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "submit/" + assignmentId + "/" + RandomUtils.generateUUID() + extension;

            // Upload the file
            OssUtils.uploadFile(file, objectName, filename, false);

            // Create new submission record
            Submit submit = new Submit();
            submit.setAssignmentId(assignmentId);
            submit.setName(filename);
            submit.setSource("oss://" + objectName);
            submit.setSubmittedBy(userId);

            // Insert submission record
            try {
                if (submitMapper.insert(submit) < 1) {
                    throw new BrainException(ResultCode.ERROR, "Submit assignment failed");
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new BrainException(ResultCode.ERROR, "Database operation failed");
            }
        }
    }


}
