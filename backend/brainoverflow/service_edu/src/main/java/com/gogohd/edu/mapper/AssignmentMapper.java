package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Assignment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface AssignmentMapper extends BaseMapper<Assignment> {

    @Select("select submit_id, name, SUBMITS.created_at as created_at, mark, user_id, username, email, avatar " +
            "from SUBMITS left join USERS on submitted_by=user_id where assignment_id=#{assignmentId} order by user_id;")
    List<Map<String, Object>> selectSubmitsByAssignmentId(@Param("assignmentId") String assignmentId);
}
