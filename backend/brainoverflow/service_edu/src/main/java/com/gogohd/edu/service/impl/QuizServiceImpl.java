package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Assignment;
import com.gogohd.edu.entity.Course;
import com.gogohd.edu.entity.Quiz;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.entity.vo.CreateQuizVo;
import com.gogohd.edu.mapper.CourseMapper;
import com.gogohd.edu.mapper.QuizMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
public class QuizServiceImpl extends ServiceImpl<QuizMapper, Quiz> implements QuizService {
    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Override
    public String createQuiz(String userId, String courseId, CreateQuizVo createQuizVo) {
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.ERROR, "Course not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create the quiz");
        }

        if (ObjectUtils.isEmpty(createQuizVo.getTitle())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz title cannot be empty");
        }
        if (ObjectUtils.isEmpty(createQuizVo.getLimitation())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz limitation cannot be empty");
        }
        if (ObjectUtils.isEmpty(createQuizVo.getStart())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz start time cannot be empty");
        }
        if (ObjectUtils.isEmpty(createQuizVo.getEnd())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz end time cannot be empty");
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(createQuizVo.getTitle());
        // quiz.setDescription(createQuizVo.getDescription());
        quiz.setLimitation(createQuizVo.getLimitation());
        quiz.setStart(DateTimeUtils.stringToDateTime(createQuizVo.getStart()));
        quiz.setEnd(DateTimeUtils.stringToDateTime(createQuizVo.getEnd()));

        quiz.setCourseId(courseId);

        baseMapper.insert(quiz);

        return quiz.getQuizId();
    }
}
