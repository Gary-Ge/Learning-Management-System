package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateQuizVo;
import com.gogohd.edu.entity.vo.UpdateQuizVo;
import com.gogohd.edu.service.QuizService;
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

    @PostMapping("quiz/{courseId}")
    public R createQuiz(HttpServletRequest request, @PathVariable String courseId,
                        @RequestBody CreateQuizVo createQuizVo) {
        String userId = (String) request.getAttribute("userId");
        String quizId = quizService.createQuiz(userId, courseId, createQuizVo);
        return R.success().message("Create quiz success").data("quizId", quizId);
    }

    @GetMapping("quiz/{quizId}")
    public R getQuizById(HttpServletRequest request, @PathVariable String quizId) {
        String userId = (String) request.getAttribute("userId");
        Map<String, Object> quiz = quizService.getQuizById(quizId, userId);
        return R.success().message("Get quiz success").data("quiz", quiz);
    }

    @GetMapping("quiz/course/{courseId}")
    public R getQuizListByCourseId(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        List<Map<String, Object>> quizzes = quizService.getQuizListByCourseId(userId, courseId);
        return R.success().message("Get quiz list success").data("quizzes", quizzes);
    }

    @DeleteMapping("quiz/{quizId}")
    public R deleteQuiz(HttpServletRequest request, @PathVariable String quizId) {
        String userId = (String) request.getAttribute("userId");
        quizService.deleteQuiz(userId, quizId);
        return R.success().message("Delete quiz success");
    }

    @PutMapping("quiz/{quizId}")
    public R updateQuiz(HttpServletRequest request, @PathVariable String quizId,
                        @RequestBody UpdateQuizVo updateQuizVo) {
        String userId = (String) request.getAttribute("userId");
        quizService.updateQuiz(userId, quizId, updateQuizVo);
        return R.success().message("Update quiz success");
    }
}
