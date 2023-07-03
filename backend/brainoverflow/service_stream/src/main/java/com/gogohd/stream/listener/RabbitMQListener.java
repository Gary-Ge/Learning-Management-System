package com.gogohd.stream.listener;

import com.gogohd.stream.entity.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class RabbitMQListener {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @RabbitListener(queues = "stream-chat")
    public void listenChatMessage(Message message) {
        simpMessagingTemplate.convertAndSend("/topic/chat/" + message.getStreamId(), message);
    }
}
