package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateQuestionVo;
import com.gogohd.edu.entity.vo.UpdateQuestionVo;
import com.gogohd.edu.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("edu-question")
@Tag(name = "Question related APIs")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @Operation(summary = "Create an question for a quiz")
    @PostMapping("question/{courseId}/{quizId}")
    public R createQuestion(HttpServletRequest request, @PathVariable String courseId,
                            @PathVariable String quizId,
                            @RequestBody CreateQuestionVo createQuestionVo) {
        String userId = (String) request.getAttribute("userId");
        String questionId = questionService.createQuestion(userId, courseId, quizId, createQuestionVo);
        return R.success().message("Create question success").data("questionId", questionId);
    }

    @Operation(summary = "Get a specific question information")
    @GetMapping("question/{questionId}")
    public R getQuestionById(HttpServletRequest request, @PathVariable String questionId) {
        String userId = (String) request.getAttribute("userId");
        Map<String, Object> question = questionService.getQuestionById(questionId, userId);
        return R.success().message("Get question success").data("question", question);
    }

    @Operation(summary = "Get a list of questions of the quiz")
    @GetMapping("questions/{quizId}")
    public R getQuestionListByQuizId(HttpServletRequest request, @PathVariable String quizId) {
        String userId = (String) request.getAttribute("userId");
        List<Map<String, Object>> questions = questionService.getQuestionListByQuizId(userId, quizId);
        return R.success().message("Get question list success").data("questions", questions);
    }

    @Operation(summary = "Delete a question")
    @DeleteMapping("question/{questionId}")
    public R deleteQuestion(HttpServletRequest request, @PathVariable String questionId) {
        String userId = (String) request.getAttribute("userId");
        questionService.deleteQuestion(userId, questionId);
        return R.success().message("Delete question success");
    }

    @Operation(summary = "Update a question")
    @PutMapping("question/{questionId}")
    public R updateQuestion(HttpServletRequest request, @PathVariable String questionId,
                            @RequestBody UpdateQuestionVo updateQuestionVo) {
        String userId = (String) request.getAttribute("userId");
        questionService.updateQuestion(userId, questionId, updateQuestionVo);
        return R.success().message("Update question success");
    }

    @Operation(summary = "Get the student's answer for a question")
    @GetMapping("question/{studentId}/{questionId}/answer")
    public R getStudentAnswerByQuestionId(HttpServletRequest request, @PathVariable String studentId,
                                          @PathVariable String questionId) {
        String userId = (String) request.getAttribute("userId");
        Object answer = questionService.getStudentAnswerByQuestionId(userId, studentId, questionId);
        return R.success().message("Get student's answer for question success").data("answer", answer);
    }

    @Operation(summary = "Get the student's answers for a quiz")
    @GetMapping("quiz/{studentId}/{quizId}/answers")
    public R getStudentAnswerByQuizId(HttpServletRequest request, @PathVariable String studentId,
                                      @PathVariable String quizId) {
        String userId = (String) request.getAttribute("userId");
        List<Map<String, Object>> answers = questionService.getStudentAnswerByQuizId(userId, studentId, quizId);
        return R.success().message("Get student's answers for quiz success").data("answers", answers);
    }

    @Operation(summary = "Mark a question by staff")
    @PutMapping("question/{questionId}/mark")
    public R markQuestionByStaffId(HttpServletRequest request, @PathVariable String questionId,
                                   @RequestParam String studentId, @RequestParam float teacherMark) {
        String userId = (String) request.getAttribute("userId");
        questionService.markQuestionByStaffId(userId, studentId, questionId, teacherMark);
        return R.success().message("Question marked by staff successfully");
    }
}
