package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Course;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.entity.Student;
import com.gogohd.edu.mapper.CourseMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.mapper.StudentMapper;
import com.gogohd.edu.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
