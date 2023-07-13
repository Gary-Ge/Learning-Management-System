package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface StudentMapper extends BaseMapper<Student> {
    @Select("select course_id, title, description, cover, has_forum, category_name, user_id, " +
            "username, email, avatar, COURSES.updated_at, COURSES.created_at from COURSES left join CATEGORIES ON " +
            "COURSES.category_id=CATEGORIES.category_id " +
            "left join USERS on COURSES.created_by=USERS.user_id where course_id in " +
            "(select course_id from STUDENTS where STUDENTS.user_id=#{userId}) order by COURSES.created_at")
    List<Map<String, Object>> selectCoursesWithCreators(@Param("userId") String userId);

    @Select("SELECT COUNT(*) FROM STUDENTS WHERE user_id = #{userId} AND course_id = #{courseId}")
    int countByUserIdAndCourseId(@Param("userId") String userId, @Param("courseId") String courseId);

    @Select("SELECT COURSES.title AS course_title, STREAMS.title AS stream_title, STREAMS.start " +
            "FROM STREAMS " +
            "INNER JOIN COURSES ON STREAMS.course_id = COURSES.course_id " +
            "INNER JOIN STUDENTS ON STUDENTS.course_id = COURSES.course_id " +
            "WHERE STUDENTS.user_id = #{userId}")
    List<Map<String, Object>> selectStreamDateByStudent(@Param("userId") String userId);
}
