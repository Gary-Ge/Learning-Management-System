package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateQuizVo;
import com.gogohd.edu.entity.vo.UpdateQuizVo;
import com.gogohd.edu.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("edu-quiz")
@Tag(name = "Quiz related APIs")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @Operation(summary = "Create a quiz for a course")
    @PostMapping("quiz/{courseId}")
    public R createQuiz(HttpServletRequest request, @PathVariable String courseId,
                        @RequestBody CreateQuizVo createQuizVo) {
        String userId = (String) request.getAttribute("userId");
        String quizId = quizService.createQuiz(userId, courseId, createQuizVo);
        return R.success().message("Create quiz success").data("quizId", quizId);
    }

    @Operation(summary = "Get a specific quiz information")
    @GetMapping("quiz/{quizId}")
    public R getQuizById(HttpServletRequest request, @PathVariable String quizId) {
        String userId = (String) request.getAttribute("userId");
        Map<String, Object> quiz = quizService.getQuizById(quizId, userId);
        return R.success().message("Get quiz success").data("quiz", quiz);
    }

    @Operation(summary = "Get a list of quizzes of this course")
    @GetMapping("quiz/course/{courseId}")
    public R getQuizListByCourseId(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        List<Map<String, Object>> quizzes = quizService.getQuizListByCourseId(userId, courseId);
        return R.success().message("Get quiz list success").data("quizzes", quizzes);
    }

    @Operation(summary = "Get a list of quizzes due by course ID")
    @GetMapping("quizzes/due/{courseId}")
    public R getQuizListDueByCourseId(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        List<Map<String, Object>> quizzesDue = quizService.getQuizListDueByCourseId(userId, courseId);
        return R.success().message("Get due quiz list success").data("quizzesDue", quizzesDue);
    }

    @Operation(summary = "Delete a quiz")
    @DeleteMapping("quiz/{quizId}")
    public R deleteQuiz(HttpServletRequest request, @PathVariable String quizId) {
        String userId = (String) request.getAttribute("userId");
        quizService.deleteQuiz(userId, quizId);
        return R.success().message("Delete quiz success");
    }

    @Operation(summary = "Update a quiz")
    @PutMapping("quiz/{quizId}")
    public R updateQuiz(HttpServletRequest request, @PathVariable String quizId,
                        @RequestBody UpdateQuizVo updateQuizVo) {
        String userId = (String) request.getAttribute("userId");
        quizService.updateQuiz(userId, quizId, updateQuizVo);
        return R.success().message("Update quiz success");
    }

    @Operation(summary = "Get all marks by quizId")
    @GetMapping("quiz/{quizId}/marks")
    public R getMarkByQuizId(HttpServletRequest request, @PathVariable String quizId) {
        String userId = (String) request.getAttribute("userId");
        List<Map<String, Object>> quizMarks = quizService.getMarkByQuizId(userId, quizId);
        return R.success().message("Get all marks of a quiz success").data("quizMarks", quizMarks);
    }
}
