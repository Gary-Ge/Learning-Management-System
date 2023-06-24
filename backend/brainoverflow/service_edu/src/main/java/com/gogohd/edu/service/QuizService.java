package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Quiz;
import com.gogohd.edu.entity.vo.CreateQuizVo;

public interface QuizService extends IService<Quiz> {
    String createQuiz(String userId, String courseId, CreateQuizVo createQuizVo);
}
