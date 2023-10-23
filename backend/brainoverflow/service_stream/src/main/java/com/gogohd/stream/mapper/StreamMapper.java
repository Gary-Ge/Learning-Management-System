package com.gogohd.stream.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.stream.entity.Stream;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface StreamMapper extends BaseMapper<Stream> {
    @Select("select count(*) from STAFFS where user_id=#{userId} and course_id=#{courseId}")
    Long selectStaffCountById(@Param("userId") String userId, @Param("courseId") String courseId);

    @Select("select count(*) from STUDENTS where user_id=#{userId} and course_id=#{courseId}")
    Long selectStudentCountById(@Param("userId") String userId, @Param("courseId") String courseId);

    @Select({
            "<script>",
            "SELECT user_id, username, email, avatar FROM USERS WHERE user_id IN ",
            "<foreach item='item' index='index' collection='list' open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"
    })
    List<Map<String, Object>> selectUserListByIds(@Param("list") List<String> list);
}
