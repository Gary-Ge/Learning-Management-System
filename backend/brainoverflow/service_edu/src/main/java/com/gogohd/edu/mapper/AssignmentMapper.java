package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Assignment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface AssignmentMapper extends BaseMapper<Assignment> {

    @Select("select submit_id, name, SUBMITS.created_at as created_at, mark, user_id, username, email, avatar " +
            "from SUBMITS left join USERS on submitted_by=user_id where assignment_id=#{assignmentId} order by user_id;")
    List<Map<String, Object>> selectSubmitsByAssignmentId(@Param("assignmentId") String assignmentId);

    @Select("SELECT A.assignment_id AS assignment_id, A.title AS assignment_title, A.end AS assignment_end, C.course_id AS course_id, C.title AS course_title " +
            "FROM ASSIGNMENTS A " +
            "INNER JOIN COURSES C ON A.course_id = C.course_id " +
            "WHERE A.course_id = #{courseId} AND A.end > #{currentDate} " +
            "ORDER BY A.end")
    List<Map<String, Object>> selectAssignmentDueByCourseId(@Param("courseId") String courseId, @Param("currentDate") LocalDateTime currentDate);
}
