package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Question;
import com.gogohd.edu.entity.vo.CreateQuestionVo;

public interface QuestionService extends IService<Question> {
    String createQuestion(String userId, String courseId, String quizId, CreateQuestionVo createQuestionVo);
}
