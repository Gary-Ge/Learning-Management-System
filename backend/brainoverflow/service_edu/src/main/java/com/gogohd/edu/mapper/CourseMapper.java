package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface CourseMapper extends BaseMapper<Course> {
    @Select("SELECT c.*, u.* FROM COURSES c INNER JOIN USERS u ON c.created_by = u.user_id WHERE c.title LIKE CONCAT('%', #{courseName}, '%')")
    List<Map<String, Object>> selectCoursesByName(String courseName);
}
