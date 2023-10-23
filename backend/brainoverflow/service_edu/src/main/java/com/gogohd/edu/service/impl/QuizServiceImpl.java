package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.entity.vo.CreateQuizVo;
import com.gogohd.edu.entity.vo.UpdateQuizVo;
import com.gogohd.edu.mapper.*;
import com.gogohd.edu.service.QuizService;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl extends ServiceImpl<QuizMapper, Quiz> implements QuizService {
    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private UserMapper userMapper;

    private final String NO_AUTHORITY_GET = "You have no authority to get sections information";

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

        // Check if a quiz with the same title already exists for the course
        LambdaQueryWrapper<Quiz> quizWrapper = new LambdaQueryWrapper<>();
        quizWrapper.eq(Quiz::getTitle, createQuizVo.getTitle());
        quizWrapper.eq(Quiz::getCourseId, courseId);
        if (baseMapper.selectCount(quizWrapper) > 0) {
            throw new BrainException(ResultCode.ERROR, "A quiz with the same title already exists for the course");
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

        try {
            LocalDateTime start = DateTimeUtils.stringToDateTime(createQuizVo.getStart());
            LocalDateTime end = DateTimeUtils.stringToDateTime(createQuizVo.getEnd());

            if (!start.isBefore(end)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The start time should be earlier than the end time");
            }
            if (!end.isAfter(LocalDateTime.now())) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The end time should be later than current time");
            }

            quiz.setStart(start);
            quiz.setEnd(end);
        } catch (DateTimeParseException e) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The format of date time should be 'yyyy-MM-dd HH:mm:ss'");
        }

        quiz.setCourseId(courseId);

        baseMapper.insert(quiz);

        return quiz.getQuizId();
    }

    private void isStaffOrStudent(String userId, String courseId) {
        // Check if this user is a staff or a student of this course
        // If this user is neither a staff nor a student of this course, this user cannot view the information
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, courseId);
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
            studentWrapper.eq(Student::getCourseId, courseId);
            studentWrapper.eq(Student::getUserId, userId);
            if (!studentMapper.exists(studentWrapper)) {
                throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_GET);
            }
        }
    }

    @Override
    public Map<String, Object> getQuizById(String quizId, String userId) {
        Quiz quiz = baseMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz does not exist");
        }

        isStaffOrStudent(userId, baseMapper.selectById(quizId).getCourseId());

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

        isStaffOrStudent(userId, courseId);

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
    public List<Map<String, Object>> getQuizListDueByCourseId(String userId, String courseId) {
        if (courseMapper.selectById(courseId) == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course does not exist");
        }

        isStaffOrStudent(userId, courseId);

        LocalDateTime currentTime = LocalDateTime.now();

        LambdaQueryWrapper<Quiz> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Quiz::getCourseId, courseId);
        wrapper.gt(Quiz::getEnd, currentTime); // Filter quizzes whose end time is before or equal to the current time
        wrapper.orderByAsc(Quiz::getEnd); // Sort by end time

        List<Quiz> quizzes = baseMapper.selectList(wrapper);

        return quizzes.stream()
                .map(quiz -> {
                    Map<String, Object> quizMap = new HashMap<>();
                    quizMap.put("title", quiz.getTitle());
                    quizMap.put("end", quiz.getEnd());
                    return quizMap;
                })
                .collect(Collectors.toList());
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

    @Override
    public List<Map<String, Object>> getMarkByQuizId(String userId, String quizId) {
        Quiz quiz = baseMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz does not exist");
        }

        isStaffOrStudent(userId, quiz.getCourseId());

        LambdaQueryWrapper<Question> questionWrapper = new LambdaQueryWrapper<>();
        questionWrapper.eq(Question::getQuizId, quizId);
        List<Question> questions = questionMapper.selectList(questionWrapper);

        LambdaQueryWrapper<Answer> answerWrapper = new LambdaQueryWrapper<>();
        answerWrapper.in(Answer::getQuestionId, questions.stream().map(Question::getQuestionId).collect(Collectors.toList()));
        List<Answer> answers = answerMapper.selectList(answerWrapper);

        Map<String, Float> studentScores = new HashMap<>();
        for (Answer answer : answers) {
            String studentId = answer.getUserId();
            float questionScore = answer.getMark();
            float studentScore = studentScores.getOrDefault(studentId, 0f);
            studentScores.put(studentId, studentScore + questionScore);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Float> entry : studentScores.entrySet()) {
            String studentId = entry.getKey();
            float totalScore = entry.getValue();

            User user = userMapper.selectById(studentId);
            if (user == null) {
                throw new BrainException(ResultCode.NOT_FOUND, "Student does not exist");
            }

            Map<String, Object> studentResult = new HashMap<>();
            studentResult.put("userId", user.getUserId());
            studentResult.put("userName", user.getUsername());
            studentResult.put("totalScore", totalScore);

            result.add(studentResult);
        }

        return result;
    }
}
