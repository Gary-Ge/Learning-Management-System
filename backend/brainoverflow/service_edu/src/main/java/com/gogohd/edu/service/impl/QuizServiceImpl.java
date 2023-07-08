package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.entity.vo.CreateQuizVo;
import com.gogohd.edu.entity.vo.UpdateQuizVo;
import com.gogohd.edu.mapper.CourseMapper;
import com.gogohd.edu.mapper.QuestionMapper;
import com.gogohd.edu.mapper.QuizMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.QuizService;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuizServiceImpl extends ServiceImpl<QuizMapper, Quiz> implements QuizService {
    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private QuestionMapper questionMapper;

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

    @Override
    public Map<String, Object> getQuizById(String quizId, String userId) {
        Quiz quiz = baseMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz does not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, quiz.getCourseId());
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to get quiz information");
        }

        Map<String, Object> result = new HashMap<>();
        Field[] fields = quiz.getClass().getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                result.put(field.getName(), field.get(quiz));
            } catch (IllegalAccessException e) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Failed to insert quiz information into result");
            }
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> getQuizListByCourseId(String userId, String courseId) {
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course does not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to get quiz list");
        }

        LambdaQueryWrapper<Quiz> quizWrapper = new LambdaQueryWrapper<>();
        quizWrapper.eq(Quiz::getCourseId, courseId);

        List<Quiz> quizList = baseMapper.selectList(quizWrapper);
        List<Map<String, Object>> resultList = new ArrayList<>();

        for (Quiz quiz : quizList) {
            Map<String, Object> result = new HashMap<>();
            Field[] fields = quiz.getClass().getDeclaredFields();
            for (Field field : fields) {
                try {
                    field.setAccessible(true);
                    result.put(field.getName(), field.get(quiz));
                } catch (IllegalAccessException e) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, "Failed to insert quiz information into result");
                }
            }
            resultList.add(result);
        }

        return resultList;
    }

    @Override
    public void deleteQuiz(String userId, String quizId) {
        Quiz quiz = baseMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz does not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, quiz.getCourseId());
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to delete this quiz");
        }

        // Delete associated questions
        LambdaQueryWrapper<Question> questionWrapper = new LambdaQueryWrapper<>();
        questionWrapper.eq(Question::getQuizId, quizId);
        questionMapper.delete(questionWrapper);

        int result = baseMapper.deleteById(quizId);
        if (result == 0) {
            throw new BrainException(ResultCode.ERROR, "Failed to delete the quiz");
        }
    }

    @Override
    public void updateQuiz(String userId, String quizId, UpdateQuizVo updateQuizVo) {
        Quiz quiz = baseMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz does not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, quiz.getCourseId());
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to update this quiz");
        }

        if (ObjectUtils.isEmpty(updateQuizVo.getTitle())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz title cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateQuizVo.getLimitation())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz limitation cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateQuizVo.getStart())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz start time cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateQuizVo.getEnd())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz end time cannot be empty");
        }

        quiz.setTitle(updateQuizVo.getTitle());
        quiz.setLimitation(updateQuizVo.getLimitation());
        quiz.setStart(DateTimeUtils.stringToDateTime(updateQuizVo.getStart()));
        quiz.setEnd(DateTimeUtils.stringToDateTime(updateQuizVo.getEnd()));

        int result = baseMapper.updateById(quiz);
        if (result == 0) {
            throw new BrainException(ResultCode.ERROR, "Failed to update the quiz");
        }
    }
}
