package com.gogohd.stream.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.stream.component.OnlineUsers;
import com.gogohd.stream.entity.*;
import com.gogohd.stream.entity.vo.AnswerQuizVo;
import com.gogohd.stream.entity.vo.CreateQuestionVo;
import com.gogohd.stream.entity.vo.CreateQuizVo;
import com.gogohd.stream.mapper.AnswerMapper;
import com.gogohd.stream.mapper.QuestionMapper;
import com.gogohd.stream.mapper.QuizMapper;
import com.gogohd.stream.mapper.StreamMapper;
import com.gogohd.stream.service.QuizService;
import com.gogohd.stream.utils.QuizUtils;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class QuizServiceImpl extends ServiceImpl<QuizMapper, Quiz> implements QuizService {

    @Autowired
    private StreamMapper streamMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private AmqpTemplate amqpTemplate;

    @Autowired
    private OnlineUsers onlineUsers;

    @Autowired
    private AnswerMapper answerMapper;

    @Value("${queues.quiz}")
    private String quizQueue;

    @Value("${queues.answer}")
    private String answerQueue;

    @Override
    @Transactional
    public String createQuiz(String userId, String streamId, CreateQuizVo createQuizVo) {
        Stream stream = streamMapper.selectById(streamId);
        if (streamMapper.selectStaffCountById(userId, stream.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY,
                    "You have no authority to create quick quiz for this stream");
        }

        // Check if another quiz is in progress
        if (stringRedisTemplate.opsForValue().get("quiz://" + streamId) != null) {
            throw new BrainException(ResultCode.ERROR, "Another quiz is in progress");
        }

        Integer limitation = createQuizVo.getLimitation();
        if (ObjectUtils.isEmpty(limitation)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz time limitation cannot be empty");
        }

        if (limitation <= 0) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Quiz time limitation should be larger than 0");
        }

        List<CreateQuestionVo> questions = createQuizVo.getQuestions();
        if (ObjectUtils.isEmpty(questions)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Questions cannot be empty");
        }

        // Create a quiz
        Quiz quiz = new Quiz();
        quiz.setStreamId(streamId);
        quiz.setLimitation(limitation);
        if (baseMapper.insert(quiz) != 1) {
            throw new BrainException(ResultCode.ERROR, "Create quick quiz failed");
        }
        String quizId = quiz.getQuizId();

        // Create a quiz message
        QuizMessage quizMessage = new QuizMessage();
        quizMessage.setLimitation(limitation);
        quizMessage.setStreamId(streamId);
        quizMessage.setQuestions(new ArrayList<>());
        quizMessage.setQuizId(quizId);

        int idx = 0;
        // Create questions
        for (CreateQuestionVo question: questions) {
            Integer type = question.getType();
            String questionContent = question.getQuestion();
            String optionA = question.getOptionA();
            String optionB = question.getOptionB();
            String optionC = question.getOptionC();
            String optionD = question.getOptionD();
            String answer = question.getAnswer();
            Integer mark = question.getMark();

            // Check if empty
            if (ObjectUtils.isEmpty(type)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question type cannot be empty");
            }
            if (ObjectUtils.isEmpty(questionContent)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question content cannot be empty");
            }
            if (ObjectUtils.isEmpty(optionA)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Option A cannot be empty");
            }
            if (ObjectUtils.isEmpty(optionB)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Option B cannot be empty");
            }
            if (ObjectUtils.isEmpty(answer)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question answer cannot be empty");
            }
            if (!ObjectUtils.isEmpty(optionD) && ObjectUtils.isEmpty(optionC)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "You cannot have option D without option C");
            }

            if (!ObjectUtils.isEmpty(mark) && mark < 0) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Question mark cannot be less than 0");
            }

            if (type != 0 && type != 1) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Type can only be 0 or 1, 0 for single choice " +
                        "and 1 for multiple choice");
            }

            int optionCount = 2;
            if (!ObjectUtils.isEmpty(optionC)) {
                ++optionCount;
            }
            if (!ObjectUtils.isEmpty(optionD)) {
                ++optionCount;
            }

            // Check the validity of answer
            // Reformat the answer string, change it to uppercase and sort the characters
            answer = answer.toUpperCase();
            char[] charArray = answer.toCharArray();
            Arrays.sort(charArray);
            answer = new String(charArray);

            if (!QuizUtils.checkAnswerValidity(answer, type, optionCount)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Bad answer format");
            }

            Question create = new Question();
            BeanUtils.copyProperties(question, create);
            create.setAnswer(answer);
            create.setQuizId(quizId);
            create.setSort(idx);

            if (questionMapper.insert(create) != 1) {
                throw new BrainException(ResultCode.ERROR, "Create question failed");
            }

            quizMessage.getQuestions().add(create);
            ++idx;
        }

        // Send message to mq, informing a quick quiz has been created
        amqpTemplate.convertAndSend(quizQueue, quizMessage);

        return quizId;
    }

    @Override
    public String answerQuiz(String userId, String quizId, AnswerQuizVo answerQuizVo) {
        Quiz quiz = baseMapper.selectById(quizId);
        if (quiz == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Quick quiz not exist");
        }

        Stream stream = streamMapper.selectById(quiz.getStreamId());
        if (stream == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Stream lesson not exist");
        }

//        if (streamMapper.selectStudentCountById(userId, stream.getCourseId()) == 0) {
//            throw new BrainException(ResultCode.NO_AUTHORITY,
//                    "You have no authority to answer this quick quiz");
//        }

        // Check if this user is online
        if (!onlineUsers.isOnline(userId, quiz.getStreamId())) {
            throw new BrainException(ResultCode.ERROR, "You cannot answer this quiz if you" +
                    "are not attending the stream lesson");
        }

        // Check if this quiz is inProgress
        String inProgressQuizId = stringRedisTemplate.opsForValue().get("quiz://" + quiz.getStreamId());
        if (inProgressQuizId == null || !inProgressQuizId.equals(quizId)) {
            throw new BrainException(ResultCode.ERROR, "The quiz has been closed");
        }

        // Get the answers list
        List<String> answers = answerQuizVo.getAnswers();
        if (ObjectUtils.isEmpty(answers)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The answers cannot be empty");
        }

        // Get the questions list
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Question::getQuizId, quizId);
        wrapper.orderByAsc(Question::getSort);
        List<Question> questions = questionMapper.selectList(wrapper);

        if (answers.size() != questions.size()) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Number of answers mismatches the number of questions");
        }

        // Check if this user has already answered this question
        LambdaQueryWrapper<Answer> answerWrapper = new LambdaQueryWrapper<>();
        answerWrapper.eq(Answer::getQuizId, quizId);
        answerWrapper.eq(Answer::getAnswerBy, userId);
        if (answerMapper.exists(answerWrapper)) {
            throw new BrainException(ResultCode.ERROR, "You have already answered this quiz");
        }

        List<String> formattedAnswers = new ArrayList<>();
        // Answer the quiz
        for (int idx = 0; idx < answers.size(); ++idx) {
            // Check the answer format
            String answer = answers.get(idx).toUpperCase();
            char[] charArray = answer.toCharArray();
            Arrays.sort(charArray);
            answer = new String(charArray);

            Question question = questions.get(idx);
            int optionCount = 2;
            if (!ObjectUtils.isEmpty(question.getOptionC())) {
                ++optionCount;
            }
            if (!ObjectUtils.isEmpty(question.getOptionD())) {
                ++optionCount;
            }

            Integer type = question.getType();

            if (!QuizUtils.checkAnswerValidity(answer, type, optionCount)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "Bad answer format");
            }

            formattedAnswers.add(answer);
        }

        Answer answer = new Answer();
        answer.setAnswerBy(userId);
        answer.setQuizId(quizId);
        answer.setAnswers(String.join(",", formattedAnswers));
        if (answerMapper.insert(answer) != 1) {
            throw new BrainException(ResultCode.ERROR, "Answer quiz failed");
        }

        AnswerMessage answerMessage = new AnswerMessage();
        answerMessage.setQuizId(quizId);
        answerMessage.setStreamId(quiz.getStreamId());
        amqpTemplate.convertAndSend(answerQueue, answerMessage);

        // TODO: 统计当前提交比多少在线学生更快

        return "offline";
    }
}
