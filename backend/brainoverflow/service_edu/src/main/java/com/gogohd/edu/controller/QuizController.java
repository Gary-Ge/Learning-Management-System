package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateQuizVo;
import com.gogohd.edu.service.QuizService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("edu-quiz")
@Tag(name = "Quiz related APIs")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping("quiz/{courseId}")
    public R createQuiz(HttpServletRequest request, @PathVariable String courseId,
                        @RequestBody CreateQuizVo createQuizVo) {
        String userId = (String) request.getAttribute("userId");
        String quizId = quizService.createQuiz(userId, courseId, createQuizVo);
        return R.success().message("Create quiz success").data("quizId", quizId);
    }
}
