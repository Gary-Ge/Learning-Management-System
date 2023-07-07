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

        return question.getQuizId();
    }
}
