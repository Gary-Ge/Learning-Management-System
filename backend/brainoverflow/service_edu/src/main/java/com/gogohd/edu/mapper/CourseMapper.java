package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface CourseMapper extends BaseMapper<Course> {
    @Select("select course_id, title, description, cover, has_forum, category_name, user_id, " +
            "username, email, avatar, COURSES.updated_at, COURSES.created_at from COURSES left join CATEGORIES ON " +
            "COURSES.category_id=CATEGORIES.category_id " +
            "left join USERS on COURSES.created_by=USERS.user_id where course_id not in (select course_id from " +
            "STUDENTS stu where stu.user_id=#{userId}) and course_id not in " +
            "(select course_id from STAFFS stf where stf.user_id=#{userId}) " +
            "and title like CONCAT('%', #{keyword}, '%') order by COURSES.created_at")
    List<Map<String, Object>> searchCoursesByName(@Param("userId") String userId, @Param("keyword") String keyword);

    @Select("select course_id, title, description, cover, has_forum, category_name, user_id, " +
            "username, email, avatar, COURSES.updated_at, COURSES.created_at from COURSES left join CATEGORIES ON " +
            "COURSES.category_id=CATEGORIES.category_id " +
            "left join USERS on COURSES.created_by=USERS.user_id where course_id not in (select course_id from " +
            "STUDENTS stu where stu.user_id=#{userId}) and course_id not in " +
            "(select course_id from STAFFS stf where stf.user_id=#{userId}) order by COURSES.created_at")
    List<Map<String, Object>> selectAllCourses(@Param("userId") String userId);

    @Select("SELECT " +
            "SECTION.section_id, SECTION.title AS section_title, SECTION.description AS section_description, " +
            "SECTION.cover AS section_cover, SECTION.type, " +
            "SECTION.created_by AS section_created_by, SECTION.updated_by AS section_updated_by, " +
            "SECTION.created_at AS section_created_at, SECTION.updated_at AS section_updated_at, " +
            "RESOURCE.resource_id, RESOURCE.title AS resource_title, RESOURCE.source, RESOURCE.type AS resource_type, " +
            "RESOURCE.created_by AS resource_created_by, RESOURCE.created_at AS resource_created_at, " +
            "RESOURCE.section_id " +
            "FROM COURSES COURSE " +
            "LEFT JOIN SECTIONS SECTION ON COURSE.course_id = SECTION.course_id " +
            "LEFT JOIN RESOURCES RESOURCE ON SECTION.section_id = RESOURCE.section_id " +
            "WHERE COURSE.course_id = #{courseId}")
    List<Map<String, Object>> selectCourseWithMaterials(@Param("courseId") String courseId);
}
