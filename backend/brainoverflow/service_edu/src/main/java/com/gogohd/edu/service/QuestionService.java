package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Question;
import com.gogohd.edu.entity.vo.CreateQuestionVo;
import com.gogohd.edu.entity.vo.MarkQuestionVo;
import com.gogohd.edu.entity.vo.UpdateQuestionVo;

import java.util.List;
import java.util.Map;

public interface QuestionService extends IService<Question> {
    String createQuestion(String userId, String courseId, String quizId, CreateQuestionVo createQuestionVo);

    Map<String, Object> getQuestionById(String questionId, String userId);

    List<Map<String, Object>> getQuestionListByQuizId(String userId, String quizId);

    void deleteQuestion(String userId, String questionId);

    void updateQuestion(String userId, String questionId, UpdateQuestionVo updateQuestionVo);

    Object getStudentAnswerByQuestionId(String userId, String questionId);

    List<Map<String, Object>> getStudentAnswerByQuizId(String userId, String quizId);

    void markQuestionByStaffId(String userId, String studentId, String questionId, MarkQuestionVo markQuestionVo);
}
