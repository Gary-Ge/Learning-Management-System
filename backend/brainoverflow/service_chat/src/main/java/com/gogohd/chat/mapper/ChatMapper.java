package com.gogohd.chat.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChatMapper extends BaseMapper<Void> {
    @Select("select username, email, created_at from USERS where user_id=#{userId}")
    Map<String, Object> selectUserById(@Param("userId") String userId);

    @Select("select COURSES.course_id AS cid, title from STUDENTS left join COURSES on " +
            "STUDENTS.course_id=COURSES.course_id where user_id=#{userId}")
    List<Map<String, Object>> selectEnrolledCoursesByUserId(@Param("userId") String userId);

    @Select("select COURSES.course_id AS cid, title from STAFFS left join COURSES on " +
            "STAFFS.course_id=COURSES.course_id where user_id=#{userId}")
    List<Map<String, Object>> selectStaffedCoursesByUserId(@Param("userId") String userId);

    @Select("select title, updated_at from SECTIONS where course_id=#{courseId} " +
            "order by updated_at desc limit 1")
    Map<String, Object> selectMostRecentSectionByCourseId(@Param("courseId") String courseId);

    @Select("select ASSIGNMENTS.title as event_title, end, COURSES.title as course_title from " +
            "ASSIGNMENTS left join COURSES on ASSIGNMENTS.course_id=COURSES.course_id where COURSES.course_id " +
            "in (select course_id from STUDENTS where user_id=#{userId})")
    List<Map<String, Object>> selectAssignmentsByUserId(@Param("userId") String userId);

    @Select("select COURSES.title as course_title, end, QUIZZES.title as event_title from QUIZZES left " +
            "join COURSES on QUIZZES.course_id=COURSES.course_id where COURSES.course_id " +
            "in (select course_id from STUDENTS where user_id=#{userId})")
    List<Map<String, Object>> selectQuizzesByUserId(@Param("userId") String userId);

    @Select("select ASSIGNMENTS.title as event_title, end, COURSES.title as course_title from " +
            "ASSIGNMENTS left join COURSES on ASSIGNMENTS.course_id=COURSES.course_id where COURSES.course_id " +
            "in (select course_id from STAFFS where user_id=#{userId})")
    List<Map<String, Object>> selectAssignmentsByUserIdForStaff(@Param("userId") String userId);

    @Select("select COURSES.title as course_title, end, QUIZZES.title as event_title from QUIZZES left " +
            "join COURSES on QUIZZES.course_id=COURSES.course_id where COURSES.course_id " +
            "in (select course_id from STAFFS where user_id=#{userId})")
    List<Map<String, Object>> selectQuizzesByUserIdForStaff(@Param("userId") String userId);

    @Select("select title, description, category_name, username, email from COURSES left join CATEGORIES ON " +
            "COURSES.category_id=CATEGORIES.category_id " +
            "left join USERS on COURSES.created_by=USERS.user_id where course_id not in (select course_id from " +
            "STUDENTS stu where stu.user_id=#{userId}) and course_id not in " +
            "(select course_id from STAFFS stf where stf.user_id=#{userId}) " +
            "and title like CONCAT('%', #{keyword}, '%') order by COURSES.created_at")
    List<Map<String, Object>> searchCoursesByKeyword(@Param("userId") String userId, @Param("keyword") String keyword);
}
