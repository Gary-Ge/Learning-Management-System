package com.gogohd.stream.listener;

import com.gogohd.stream.entity.Message;
import com.gogohd.stream.entity.QuizMessage;
import com.gogohd.stream.entity.UserList;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class RabbitMQListener {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

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
}
