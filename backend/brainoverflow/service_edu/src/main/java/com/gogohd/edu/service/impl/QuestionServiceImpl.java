package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.entity.vo.CreateQuestionVo;
import com.gogohd.edu.entity.vo.MarkQuestionVo;
import com.gogohd.edu.entity.vo.UpdateQuestionVo;
import com.gogohd.edu.mapper.*;
import com.gogohd.edu.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, Question> implements QuestionService {
    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private QuizMapper quizMapper;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private UserMapper userMapper;

    private final String NO_AUTHORITY_GET = "You have no authority to get question information";
    private final String NO_AUTHORITY_DELETE = "You have no authority to delete this question";
    private final String NO_AUTHORITY_UPDATE = "You have no authority to update this question";

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

        if (ObjectUtils.isEmpty(createQuestionVo.getContent())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question Content cannot be empty");
        }
        if (ObjectUtils.isEmpty(createQuestionVo.getType())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question Type cannot be empty");
        }
        if (ObjectUtils.isEmpty(createQuestionVo.getMark())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question mark cannot be empty");
        }

        Question question = new Question();
        question.setContent(createQuestionVo.getContent());
        question.setType(createQuestionVo.getType());
        question.setMark(createQuestionVo.getMark());
        if (ObjectUtils.isEmpty(createQuestionVo.getCover())) {
            question.setCover("https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/cover/default/default-cover.jpg");
        }
        else {
            question.setCover(createQuestionVo.getCover());
        }

        switch (createQuestionVo.getType()) {
            case 0: // single choice
                if (ObjectUtils.isEmpty(createQuestionVo.getA()) || ObjectUtils.isEmpty(createQuestionVo.getB())) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, "Options A and B cannot be empty for single-choice question");
                }
                question.setA(createQuestionVo.getA());
                question.setB(createQuestionVo.getB());
                question.setC(ObjectUtils.isEmpty(createQuestionVo.getC()) ? "" : createQuestionVo.getC());
                question.setD(ObjectUtils.isEmpty(createQuestionVo.getD()) ? "" : createQuestionVo.getD());
                question.setE(ObjectUtils.isEmpty(createQuestionVo.getE()) ? "" : createQuestionVo.getE());
                question.setF(ObjectUtils.isEmpty(createQuestionVo.getF()) ? "" : createQuestionVo.getF());

                int correctCount = 0;
                if (createQuestionVo.getACorrect() == 1) correctCount++;
                if (createQuestionVo.getBCorrect() == 1) correctCount++;
                if (createQuestionVo.getCCorrect() == 1) correctCount++;
                if (createQuestionVo.getDCorrect() == 1) correctCount++;
                if (createQuestionVo.getECorrect() == 1) correctCount++;
                if (createQuestionVo.getFCorrect() == 1) correctCount++;
                if (correctCount != 1) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, "Single-choice question must have one correct answer");
                }

                question.setACorrect(createQuestionVo.getACorrect());
                question.setBCorrect(createQuestionVo.getBCorrect());
                question.setCCorrect(createQuestionVo.getCCorrect());
                question.setDCorrect(createQuestionVo.getDCorrect());
                question.setECorrect(createQuestionVo.getECorrect());
                question.setFCorrect(createQuestionVo.getFCorrect());
                break;

            case 1: // multi choice
                if (ObjectUtils.isEmpty(createQuestionVo.getA()) || ObjectUtils.isEmpty(createQuestionVo.getB())) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, "Options A and B cannot be empty for multiple-choice question");
                }
                question.setA(createQuestionVo.getA());
                question.setB(createQuestionVo.getB());
                question.setC(ObjectUtils.isEmpty(createQuestionVo.getC()) ? "" : createQuestionVo.getC());
                question.setD(ObjectUtils.isEmpty(createQuestionVo.getD()) ? "" : createQuestionVo.getD());
                question.setE(ObjectUtils.isEmpty(createQuestionVo.getE()) ? "" : createQuestionVo.getE());
                question.setF(ObjectUtils.isEmpty(createQuestionVo.getF()) ? "" : createQuestionVo.getF());

                question.setACorrect(createQuestionVo.getACorrect());
                question.setBCorrect(createQuestionVo.getBCorrect());
                question.setCCorrect(createQuestionVo.getCCorrect());
                question.setDCorrect(createQuestionVo.getDCorrect());
                question.setECorrect(createQuestionVo.getECorrect());
                question.setFCorrect(createQuestionVo.getFCorrect());
                break;

            case 2: // short answer
                question.setA("");
                question.setB("");
                question.setC("");
                question.setD("");
                question.setE("");
                question.setF("");
                question.setACorrect(0);
                question.setBCorrect(0);
                question.setCCorrect(0);
                question.setDCorrect(0);
                question.setECorrect(0);
                question.setFCorrect(0);
                question.setShortAnswer(createQuestionVo.getShortAnswer());
                break;

            default:
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Invalid question type");
        }

        question.setQuizId(quizId);

        baseMapper.insert(question);

        return question.getQuestionId();
    }

    private void isStaffOrStudent(String userId, String courseId) {
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

    private void isStaff(String userId, String courseId) {
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, courseId);
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_GET);
       }
    }

    @Override
    public Map<String, Object> getQuestionById(String questionId, String userId) {
        Question question = baseMapper.selectById(questionId);
        if (question == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Question does not exist");
        }

        // Check if this user has authority to get this assignment information
        isStaffOrStudent(userId, quizMapper.selectById(question.getQuizId()).getCourseId());

        // Construct the result
        Map<String, Object> result = new HashMap<>();
        Field[] fields = question.getClass().getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                result.put(field.getName(), field.get(question));
            } catch (IllegalAccessException e) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Failed to insert to result of question");
            }
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> getQuestionListByQuizId(String userId, String quizId) {
        if (quizMapper.selectById(quizId) == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz does not exist");
        }

        isStaffOrStudent(userId, quizMapper.selectById(quizId).getCourseId());

        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Question::getQuizId, quizId);
        wrapper.orderByAsc(Question::getCreatedAt);

        return baseMapper.selectList(wrapper).stream()
                .map(question -> {
                    Map<String, Object> result = new HashMap<>();
                    Field[] fields = question.getClass().getDeclaredFields();
                    for (Field field : fields) {
                        try {
                            field.setAccessible(true);
                            result.put(field.getName(), field.get(question));
                        } catch (IllegalAccessException e) {
                            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Failed to insert to result of question");
                        }
                    }

                    return result;
                }).collect(Collectors.toList());
    }

    private void checkQuestionValidity(String userId, String questionId, String noAuthority) {
        Question question = (baseMapper.selectById(questionId));
        if  (question == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Question does not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, quizMapper.selectById(question.getQuizId()).getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, noAuthority);
        }
    }

    @Override
    @Transactional
    public void deleteQuestion(String userId, String questionId) {
        checkQuestionValidity(userId, questionId, NO_AUTHORITY_DELETE);

        if (baseMapper.deleteById(questionId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete assignment failed");
        }
    }

    @Override
    @Transactional
    public void updateQuestion(String userId, String questionId, UpdateQuestionVo updateQuestionVo) {
        checkQuestionValidity(userId, questionId, NO_AUTHORITY_UPDATE);

        if (ObjectUtils.isEmpty(updateQuestionVo.getContent())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question content cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateQuestionVo.getType())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question type cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateQuestionVo.getMark())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question mark cannot be empty");
        }

        Question question = new Question();
        question.setQuestionId(questionId);
        question.setContent(updateQuestionVo.getContent());
        question.setType(updateQuestionVo.getType());
        question.setMark(updateQuestionVo.getMark());
        question.setCover(ObjectUtils.isEmpty(updateQuestionVo.getCover()) ? "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/cover/default/default-cover.jpg" : updateQuestionVo.getCover());

        switch (updateQuestionVo.getType()) {
            case 0: // single choice
                if (ObjectUtils.isEmpty(updateQuestionVo.getA()) || ObjectUtils.isEmpty(updateQuestionVo.getB())) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, "Options A and B cannot be empty for single-choice question");
                }
                question.setA(updateQuestionVo.getA());
                question.setB(updateQuestionVo.getB());
                question.setC(ObjectUtils.isEmpty(updateQuestionVo.getC()) ? "" : updateQuestionVo.getC());
                question.setD(ObjectUtils.isEmpty(updateQuestionVo.getD()) ? "" : updateQuestionVo.getD());
                question.setE(ObjectUtils.isEmpty(updateQuestionVo.getE()) ? "" : updateQuestionVo.getE());
                question.setF(ObjectUtils.isEmpty(updateQuestionVo.getF()) ? "" : updateQuestionVo.getF());

                int correctCount = 0;
                if (updateQuestionVo.getACorrect() == 1) correctCount++;
                if (updateQuestionVo.getBCorrect() == 1) correctCount++;
                if (updateQuestionVo.getCCorrect() == 1) correctCount++;
                if (updateQuestionVo.getDCorrect() == 1) correctCount++;
                if (updateQuestionVo.getECorrect() == 1) correctCount++;
                if (updateQuestionVo.getFCorrect() == 1) correctCount++;
                if (correctCount != 1) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, "Single-choice question must have one correct answer");
                }

                question.setACorrect(updateQuestionVo.getACorrect());
                question.setBCorrect(updateQuestionVo.getBCorrect());
                question.setCCorrect(updateQuestionVo.getCCorrect());
                question.setDCorrect(updateQuestionVo.getDCorrect());
                question.setECorrect(updateQuestionVo.getECorrect());
                question.setFCorrect(updateQuestionVo.getFCorrect());
                break;

            case 1: // multi choice
                if (ObjectUtils.isEmpty(updateQuestionVo.getA()) || ObjectUtils.isEmpty(updateQuestionVo.getB())) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, "Options A and B cannot be empty for multiple-choice question");
                }
                question.setA(updateQuestionVo.getA());
                question.setB(updateQuestionVo.getB());
                question.setC(ObjectUtils.isEmpty(updateQuestionVo.getC()) ? "" : updateQuestionVo.getC());
                question.setD(ObjectUtils.isEmpty(updateQuestionVo.getD()) ? "" : updateQuestionVo.getD());
                question.setE(ObjectUtils.isEmpty(updateQuestionVo.getE()) ? "" : updateQuestionVo.getE());
                question.setF(ObjectUtils.isEmpty(updateQuestionVo.getF()) ? "" : updateQuestionVo.getF());

                question.setACorrect(updateQuestionVo.getACorrect());
                question.setBCorrect(updateQuestionVo.getBCorrect());
                question.setCCorrect(updateQuestionVo.getCCorrect());
                question.setDCorrect(updateQuestionVo.getDCorrect());
                question.setECorrect(updateQuestionVo.getECorrect());
                question.setFCorrect(updateQuestionVo.getFCorrect());
                break;

            case 2: // short answer
                question.setA("");
                question.setB("");
                question.setC("");
                question.setD("");
                question.setE("");
                question.setF("");
                question.setACorrect(0);
                question.setBCorrect(0);
                question.setCCorrect(0);
                question.setDCorrect(0);
                question.setECorrect(0);
                question.setFCorrect(0);
                question.setShortAnswer(updateQuestionVo.getShortAnswer());
                break;

            default:
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Invalid question type");
        }

        int result = baseMapper.updateById(question);
        if (result == 0) {
            throw new BrainException(ResultCode.ERROR, "Failed to update the question");
        }
    }

    @Override
    public Object getStudentAnswerByQuestionId(String userId, String questionId) {
        Question question = baseMapper.selectById(questionId);
        if (question == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Question does not exist");
        }

        // Check if this user has authority to get student question answer information
        isStaffOrStudent(userId, quizMapper.selectById(question.getQuizId()).getCourseId());

        LambdaQueryWrapper<Answer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Answer::getUserId, userId);
        wrapper.eq(Answer::getQuestionId, questionId);
        return answerMapper.selectOne(wrapper);
    }

    @Override
    public List<Map<String, Object>> getStudentAnswerByQuizId(String userId, String quizId) {
        Quiz quiz = quizMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quiz does not exist");
        }

        isStaffOrStudent(userId, quizMapper.selectById(quizId).getCourseId());

        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Question::getQuizId, quizId);
        wrapper.orderByAsc(Question::getCreatedAt);

        List<Question> questionList = baseMapper.selectList(wrapper);

        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Question question : questionList) {
            LambdaQueryWrapper<Answer> answerWrapper = new LambdaQueryWrapper<>();
            answerWrapper.eq(Answer::getQuestionId, question.getQuestionId());
            List<Answer> answerList = answerMapper.selectList(answerWrapper);

            for (Answer answer : answerList) {
                Map<String, Object> resultMap = new HashMap<>();
                resultMap.put("question", question);
                resultMap.put("answer", answer);

                User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                        .eq(User::getUserId, answer.getUserId()));

                if (user != null) {
                    resultMap.put("user", user);
                }
                resultList.add(resultMap);
            }
        }

        return resultList;
    }

    @Override
    @Transactional
    public void markQuestionByStaffId(String userId, String studentId, String questionId, MarkQuestionVo markQuestionVo) {
        // Get the question
        Question question = baseMapper.selectById(questionId);
        if (question == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Question does not exist");
        }

        // Check if the user is a staff member
        isStaff(userId, quizMapper.selectById(question.getQuizId()).getCourseId());

        // Get the answer for the student and question
        LambdaQueryWrapper<Answer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Answer::getUserId, studentId);
        wrapper.eq(Answer::getQuestionId, questionId);
        List<Answer> answers = answerMapper.selectList(wrapper);

        if (answers.size() == 0) {
            throw new BrainException(ResultCode.NOT_FOUND, "Cannot find answers from this student");
        }

        if (ObjectUtils.isEmpty(markQuestionVo.getMark())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The mark cannot be empty");
        }

        Float mark = markQuestionVo.getMark();
        Quiz quiz = quizMapper.selectById(baseMapper.selectById(answers.get(0).getQuestionId()).getQuizId());
        if (LocalDateTime.now().isBefore(quiz.getStart())) {
            throw new BrainException(ResultCode.ERROR,
                    "You cannot mark the question before the start date of the quiz");
        }
        if (mark < 0 || mark > question.getMark()) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS,
                    "Mark should be larger or equal to 0 and less or equal to the mark upper bound");
        }

        // Update mark
        Answer answer = new Answer();
        answer.setMark(mark);
        answerMapper.update(answer, wrapper);
    }
}
