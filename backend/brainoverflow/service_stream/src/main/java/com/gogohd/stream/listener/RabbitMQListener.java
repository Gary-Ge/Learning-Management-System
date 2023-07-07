package com.gogohd.stream.listener;

import com.gogohd.stream.entity.Message;
import com.gogohd.stream.entity.UserList;
import com.gogohd.stream.mapper.StreamMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class RabbitMQListener {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final String TOPIC = "/topic/stream/";

    @RabbitListener(queues = "stream-chat")
    public void listenChatMessage(Message message) {
        simpMessagingTemplate.convertAndSend(TOPIC + message.getStreamId(), message);
    }

    @RabbitListener(queues = "stream-users")
    public void listenUserListMessage(UserList userList) {
        simpMessagingTemplate.convertAndSend(TOPIC + userList.getStreamId(), userList);
    }
}
