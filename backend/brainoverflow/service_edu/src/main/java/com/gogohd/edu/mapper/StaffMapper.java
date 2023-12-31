package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Staff;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface StaffMapper extends BaseMapper<Staff> {
    @Select("select course_id, title, description, cover, has_forum, category_name, user_id, " +
            "username, email, avatar, COURSES.updated_at, COURSES.created_at from COURSES left join CATEGORIES ON " +
            "COURSES.category_id=CATEGORIES.category_id " +
            "left join USERS on COURSES.created_by=USERS.user_id where course_id in " +
            "(select course_id from STAFFS where STAFFS.user_id=#{userId}) order by COURSES.created_at")
    List<Map<String, Object>> selectCoursesWithCreators(@Param("userId") String userId);


    @Select("SELECT COURSES.title AS course_title, STREAMS.title AS stream_title, STREAMS.start " +
            "FROM STREAMS " +
            "INNER JOIN COURSES ON STREAMS.course_id = COURSES.course_id " +
            "INNER JOIN STAFFS ON STAFFS.course_id = COURSES.course_id " +
            "WHERE STAFFS.user_id = #{userId}")
    List<Map<String, Object>> selectStreamDateWithCreators(@Param("userId") String userId);

    @Select("select course_id, title, description, cover, has_forum, category_name, user_id, " +
            "username, email, avatar, COURSES.updated_at, COURSES.created_at from COURSES left join CATEGORIES ON " +
            "COURSES.category_id=CATEGORIES.category_id " +
            "left join USERS on COURSES.created_by=USERS.user_id where course_id in " +
            "(select course_id from STAFFS where STAFFS.user_id=#{userId}) and has_forum=1 order by COURSES.created_at")
    List<Map<String, Object>> selectCoursesWithForumAndCreators(@Param("userId") String userId);


    @Select("SELECT STREAMS.title AS stream_title, STREAMS.end AS stream_end, " +
            "ASSIGNMENTS.title AS assignment_title, ASSIGNMENTS.end AS assignment_end, " +
            "QUIZZES.title AS quiz_title, QUIZZES.end AS quiz_end " +
            "FROM COURSES " +
            "INNER JOIN STAFFS ON COURSES.course_id = STAFFS.course_id " +
            "LEFT JOIN STREAMS ON COURSES.course_id = STREAMS.course_id " +
            "LEFT JOIN ASSIGNMENTS ON COURSES.course_id = ASSIGNMENTS.course_id " +
            "LEFT JOIN QUIZZES ON COURSES.course_id = QUIZZES.course_id " +
            "WHERE STAFFS.user_id = #{userId} " +
            "AND (STREAMS.end IS NULL OR STREAMS.end > #{currentDate}) " +
            "AND (ASSIGNMENTS.end IS NULL OR ASSIGNMENTS.end > #{currentDate}) " +
            "AND (QUIZZES.end IS NULL OR QUIZZES.end > #{currentDate}) " +
            "ORDER BY STREAMS.end, ASSIGNMENTS.end, QUIZZES.end")
    List<Map<String, Object>> selectDueDateWithCreators(@Param("userId") String userId, @Param("currentDate") LocalDateTime currentDate);

}
