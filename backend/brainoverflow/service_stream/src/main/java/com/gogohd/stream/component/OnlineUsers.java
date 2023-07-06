package com.gogohd.stream.component;

import com.gogohd.stream.entity.UserList;
import com.gogohd.stream.mapper.StreamMapper;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OnlineUsers {
    private final Map<String, ConcurrentHashMap<String, String>> onlineUsers = new ConcurrentHashMap<>();

    @Autowired
    private AmqpTemplate amqpTemplate;

    @Autowired
    private StreamMapper streamMapper;

    public void userJoin(String sessionId, String userId, String streamId) {
        // Update online users hashmap
        if (!onlineUsers.containsKey(streamId)) {
            onlineUsers.put(streamId, new ConcurrentHashMap<>());
        }
        onlineUsers.get(streamId).put(sessionId, userId);

        // Get all the userIds of this stream
        List<String> userIds = new ArrayList<>(onlineUsers.get(streamId).values());

        // Fetch user information
        UserList userList = new UserList();
        userList.setStreamId(streamId);
        userList.setUserList(new LinkedList<>());
        if (userIds.size() > 0) {
            userList.setUserList(streamMapper.selectUserListByIds(userIds));
        }

        // Send messages to mq to notify a user list updating
        amqpTemplate.convertAndSend("stream-users", userList);
    }

    public void userLeave(String sessionId, String streamId) {
        if (onlineUsers.get(streamId).containsKey(sessionId)) {
            onlineUsers.get(streamId).remove(sessionId);

            // Get all the userIds of this stream
            List<String> userIds = new ArrayList<>(onlineUsers.get(streamId).values());

            // Fetch user information
            UserList userList = new UserList();
            userList.setStreamId(streamId);
            userList.setUserList(new LinkedList<>());
            if (userIds.size() > 0) {
                userList.setUserList(streamMapper.selectUserListByIds(userIds));
            }

            // Send messages to mq to notify a user list updating
            amqpTemplate.convertAndSend("stream-users", userList);
        }
    }
}