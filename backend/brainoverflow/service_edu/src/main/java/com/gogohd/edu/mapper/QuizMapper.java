package com.gogohd.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.edu.entity.Quiz;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface QuizMapper extends BaseMapper<Quiz> {
    @Select("SELECT Q.quiz_id AS quiz_id, Q.title AS quiz_title, Q.end AS quiz_end, C.course_id AS course_id, C.title AS course_title " +
            "FROM QUIZZES Q " +
            "INNER JOIN COURSES C ON Q.course_id = C.course_id " +
            "WHERE Q.course_id = #{courseId} AND Q.end > #{currentDate} " +
            "ORDER BY Q.end")
    List<Map<String, Object>> selectQuizDueByCourseId(@Param("courseId") String courseId, @Param("currentDate") LocalDateTime currentDate);
}
