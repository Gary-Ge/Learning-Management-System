package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Quiz;
import com.gogohd.edu.entity.vo.CreateQuizVo;
import com.gogohd.edu.entity.vo.UpdateQuestionVo;
import com.gogohd.edu.entity.vo.UpdateQuizVo;

import java.util.List;
import java.util.Map;

public interface QuizService extends IService<Quiz> {
    String createQuiz(String userId, String courseId, CreateQuizVo createQuizVo);

    Map<String, Object> getQuizById(String quizId, String userId);

    List<Map<String, Object>> getQuizListByCourseId(String userId, String courseId);

    List<Map<String, Object>> getQuizListDueByCourseId(String userId, String courseId);

    void deleteQuiz(String userId, String quizId);

    void updateQuiz(String userId, String quizId, UpdateQuizVo updateQuizVo);
}
