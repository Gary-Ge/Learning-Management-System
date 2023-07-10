package com.gogohd.stream.controller;

import com.gogohd.base.utils.R;
import com.gogohd.stream.entity.vo.AnswerQuizVo;
import com.gogohd.stream.entity.vo.CreateQuizVo;
import com.gogohd.stream.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("stream-quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @Operation(summary = "Create a quick quiz for a stream lesson")
    @PostMapping("/quiz/{streamId}")
    public R createQuiz(HttpServletRequest request, @PathVariable String streamId,
                        @RequestBody CreateQuizVo createQuizVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Create and publish quick quiz success").data("quizId",
                quizService.createQuiz(userId, streamId, createQuizVo));
    }

    @Operation(summary = "Answer all the questions of a quick quiz")
    @PostMapping("/quiz/answer/{quizId}")
    public R answerQuiz(HttpServletRequest request, @PathVariable String quizId,
                        @RequestBody AnswerQuizVo answerQuizVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Answer quick quiz success").data("fasterThan",
                quizService.answerQuiz(userId, quizId, answerQuizVo));
    }
}
