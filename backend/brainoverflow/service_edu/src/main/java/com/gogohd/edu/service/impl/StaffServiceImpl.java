package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.mapper.AssignmentMapper;
import com.gogohd.edu.mapper.CourseMapper;
import com.gogohd.edu.mapper.QuizMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl extends ServiceImpl<StaffMapper, Staff> implements StaffService {
    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private AssignmentMapper assignmentMapper;

    @Autowired
    private QuizMapper quizMapper;

    @Override
    public void createStaff(String userId, String courseId) {
        // Create new staff
        Staff staff = new Staff();
        staff.setUserId(userId);
        staff.setCourseId(courseId);

        // Insert to data table
        if (!save(staff)) {
            throw new BrainException(ResultCode.ERROR, "Add staff failed");
        }
    }

    @Override
    public Object getStaffedCourseListByUserId(String userId) {
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
    public Object getStaffedStreamListDateByUserId(String userId) {
        return baseMapper.selectStreamDateWithCreators(userId).stream()
                .map(record -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("course_title", record.get("course_title"));
                    map.put("stream_title", record.get("stream_title"));
                    map.put("start", record.get("start"));
                    return map;
                }).collect(Collectors.toList());
    }

    public Object getStaffedCourseListWithForumByUserId(String userId) {
        return baseMapper.selectCoursesWithForumAndCreators(userId).stream()
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

    public Object getStaffedDueListByUserId(String userId) {
        LocalDateTime currentTime = LocalDateTime.now();
        Object enrolledCourses = getStaffedCourseListByUserId(userId);
        List<Map<String, Object>> teachCourseList = (List<Map<String, Object>>) enrolledCourses;

        Map<String, Object> dueDateList = new HashMap<>();
        List<Object> assignmentList = new ArrayList<>();
        List<Object> quizList = new ArrayList<>();
        List<Object> streamList = new ArrayList<>();

        for (Map<String, Object> enrolledCourse : teachCourseList) {
            String courseId = (String) enrolledCourse.get("courseId");

            List<Map<String, Object>> assDueList = assignmentMapper.selectAssignmentDueByCourseId(courseId, currentTime);
            if (!assDueList.isEmpty()) {
                assignmentList.add(assDueList);
            }

            List<Map<String, Object>> quizDueList = quizMapper.selectQuizDueByCourseId(courseId, currentTime);
            if (!quizDueList.isEmpty()) {
                quizList.add(quizDueList);
            }

            List<Map<String, Object>> streamDueList = courseMapper.selectStreamDueByCourseId(courseId, currentTime);
            if (!streamDueList.isEmpty()) {
                streamList.add(streamDueList);
            }
        }

        dueDateList.put("AssignmentList", assignmentList);
        dueDateList.put("QuizList", quizList);
        dueDateList.put("StreamList", streamList);

        return dueDateList;
    }
}
