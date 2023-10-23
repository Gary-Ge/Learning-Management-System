package com.gogohd.stream.listener;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gogohd.stream.entity.*;
import com.gogohd.stream.mapper.AnswerMapper;
import com.gogohd.stream.mapper.QuestionMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Component
public class RabbitMQListener {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private QuestionMapper questionMapper;

    private final String TOPIC = "/topic/stream/";

    @RabbitListener(queues = "${queues.chat}")
    public void listenChatMessage(Message message) {
        simpMessagingTemplate.convertAndSend(TOPIC + message.getStreamId(), message);
    }

    @RabbitListener(queues = "${queues.users}")
    public void listenUserListMessage(UserList userList) {
        simpMessagingTemplate.convertAndSend(TOPIC + userList.getStreamId(), userList);
    }

    @RabbitListener(queues = "${queues.quiz}")
    public void listenQuizMessage(QuizMessage quizMessage) {
        // Publish this quiz
        stringRedisTemplate.opsForValue().set("quiz://" + quizMessage.getStreamId(), quizMessage.getQuizId(),
                quizMessage.getLimitation(), TimeUnit.SECONDS);
        simpMessagingTemplate.convertAndSend(TOPIC + quizMessage.getStreamId(), quizMessage);
    }

    @RabbitListener(queues = "${queues.answer}")
    public void listenAnswerMessage(AnswerMessage answerMessage) {
        // Get all the answers for this quiz
        String quizId = answerMessage.getQuizId();
        LambdaQueryWrapper<Answer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Answer::getQuizId, quizId);
        List<String> answers = answerMapper.selectList(wrapper).stream()
                .map(Answer::getAnswers).collect(Collectors.toList());

        // Get how many questions in this quiz
        LambdaQueryWrapper<Question> questionWrapper = new LambdaQueryWrapper<>();
        questionWrapper.eq(Question::getQuizId, quizId);
        questionWrapper.orderByAsc(Question::getSort);
        List<Map<String, Object>> distribution = questionMapper.selectList(questionWrapper).stream()
                .map(question -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("questionId", question.getQuestionId());

                    map.put("countA", 0);
                    map.put("countB", 0);
                    map.put("countC", 0);
                    map.put("countD", 0);

                    map.put("distA", 0.0);
                    map.put("distB", 0.0);
                    map.put("distC", 0.0);
                    map.put("distD", 0.0);
                    return map;
                }).collect(Collectors.toList());

        // If there is no answer available, return
        int answersSize = answers.size();
        if (answersSize == 0) {
            return;
        }

        // Statistic the distribution of answers
        String streamId = answerMessage.getStreamId();

        AnswerDistributionMessage message = new AnswerDistributionMessage();
        message.setQuizId(quizId);
        message.setStreamId(streamId);

        for (String answer: answers) {
            String[] answerSingle = answer.split(",");
            if (answerSingle.length != distribution.size()) {
                continue;
            }

            for (int i = 0; i < answerSingle.length; i++) {
                String currentAnswer = answerSingle[i];

                Map<String, Object> dist = distribution.get(i);

                for (int j = 0; j < currentAnswer.length(); j++) {
                    char c = currentAnswer.charAt(j);
                    if (c == 'A') {
                        int countA = ((int) dist.get("countA")) + 1;
                        dist.put("countA", countA);
                        dist.put("distA", countA / (double) answersSize);
                    } else if (c == 'B') {
                        int countB = ((int) dist.get("countB")) + 1;
                        dist.put("countB", countB);
                        dist.put("distB", countB / (double) answersSize);
                    } else if (c == 'C') {
                        int countC = ((int) dist.get("countC")) + 1;
                        dist.put("countC", countC);
                        dist.put("distC", countC / (double) answersSize);
                    } else if (c == 'D') {
                        int countD = ((int) dist.get("countD")) + 1;
                        dist.put("countD", countD);
                        dist.put("distD", countD / (double) answersSize);
                    }
                }
            }
        }

        message.setQuestions(distribution);
        simpMessagingTemplate.convertAndSend(TOPIC + streamId, message);
    }
}
