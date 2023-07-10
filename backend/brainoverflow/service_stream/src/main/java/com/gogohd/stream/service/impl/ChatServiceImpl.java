package com.gogohd.stream.service.impl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.R;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.stream.client.OpenFeignClient;
import com.gogohd.stream.entity.Message;
import com.gogohd.stream.entity.Stream;
import com.gogohd.stream.mapper.StreamMapper;
import com.gogohd.stream.service.ChatService;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    private AmqpTemplate amqpTemplate;

    @Autowired
    private StreamMapper streamMapper;

    @Autowired
    private OpenFeignClient openFeignClient;

    @Value("${queues.chat}")
    private String chatQueue;

    @Override
    @SuppressWarnings("unchecked")
    public void sendMessage(String userId, String token, String streamId, String message) {
        Stream stream = streamMapper.selectById(streamId);
        if (stream == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Stream lesson not exist");
        }
        if (streamMapper.selectStaffCountById(userId, stream.getCourseId()) == 0 &&
                streamMapper.selectStudentCountById(userId, stream.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to send messages to this " +
                    "stream's chatroom");
        }

        // Fetch sender information
        R userResponse;
        try {
            userResponse = openFeignClient.getUser(userId, token);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Fetch user information failed");
        }
        Map<String, String> userData = (Map<String, String>) userResponse.getData().get("user");

        // Create message
        Message send = new Message();

        // Set sender information
        send.setUsername(userData.get("username"));
        send.setAvatar(userData.get("avatar"));
        send.setEmail(userData.get("email"));

        // Set message information
        send.setTime(DateTimeUtils.dateTimeToString(LocalDateTime.now()));
        send.setStreamId(streamId);
        send.setUserId(userId);
        send.setMessage(message);

        // Send message to rabbitMQ
        amqpTemplate.convertAndSend(chatQueue, send);
    }
}
