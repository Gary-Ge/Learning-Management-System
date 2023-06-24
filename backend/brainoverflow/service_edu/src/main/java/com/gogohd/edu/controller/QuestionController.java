package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateQuestionVo;
import com.gogohd.edu.service.QuestionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("edu-question")
@Tag(name = "Question related APIs")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @PostMapping("question/{courseId}/{quizId}")
    public R createQuestion(HttpServletRequest request, @PathVariable String courseId,
                            @PathVariable String quizId,
                            @RequestBody CreateQuestionVo createQuestionVo) {
        String userId = (String) request.getAttribute("userId");
        String questionId = questionService.createQuestion(userId, courseId, quizId, createQuestionVo);
        return R.success().message("Create question success").data("quesstionId", questionId);
    }
}
