package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Course;
import com.gogohd.edu.entity.Question;
import com.gogohd.edu.entity.Quiz;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.entity.vo.CreateQuestionVo;
import com.gogohd.edu.mapper.CourseMapper;
import com.gogohd.edu.mapper.QuestionMapper;
import com.gogohd.edu.mapper.QuizMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.QuestionService;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, Question> implements QuestionService {
    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private QuizMapper quizMapper;

    @Override
    public String createQuestion(String userId, String courseId, String quizId, CreateQuestionVo createQuestionVo) {
        Quiz quiz = quizMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.ERROR, "Quiz not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create the quiz");
        }

        if (ObjectUtils.isEmpty(createQuestionVo.getDescription())) {
        throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question Description cannot be empty");
        }
        if (ObjectUtils.isEmpty(createQuestionVo.getType())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question type cannot be empty");
        }
        if (ObjectUtils.isEmpty(createQuestionVo.getCorrect())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question correct answer cannot be empty");
        }

        Question question = new Question();
        question.setDescription(createQuestionVo.getDescription());
        question.setImage(createQuestionVo.getImage());
        question.setType(createQuestionVo.getType());
        question.setCorrect(createQuestionVo.getCorrect());

        question.setQuizId(quizId);

        baseMapper.insert(question);

        return question.getQuizId();
    }
}
