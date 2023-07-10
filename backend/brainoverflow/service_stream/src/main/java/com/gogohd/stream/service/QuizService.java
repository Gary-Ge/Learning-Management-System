package com.gogohd.stream.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.stream.entity.Quiz;
import com.gogohd.stream.entity.vo.AnswerQuizVo;
import com.gogohd.stream.entity.vo.CreateQuizVo;

public interface QuizService extends IService<Quiz> {
    String createQuiz(String userId, String streamId, CreateQuizVo createQuizVo);

    String answerQuiz(String userId, String quizId, AnswerQuizVo answerQuizVo);
}
