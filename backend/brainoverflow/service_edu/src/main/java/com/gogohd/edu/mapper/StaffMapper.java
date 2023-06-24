package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Staff;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

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
}
