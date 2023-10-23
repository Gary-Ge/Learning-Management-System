package com.gogohd.forum.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.forum.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
    @Select("select count(*) from STAFFS where user_id=#{userId} and course_id=#{courseId}")
    Long selectStaffCountById(@Param("userId") String userId, @Param("courseId") String courseId);

    @Select("select count(*) from STUDENTS where user_id=#{userId} and course_id=#{courseId}")
    Long selectStudentCountById(@Param("userId") String userId, @Param("courseId") String courseId);
}
