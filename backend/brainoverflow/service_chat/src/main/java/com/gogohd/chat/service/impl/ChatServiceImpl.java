package com.gogohd.chat.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.chat.entity.vo.SendMessageVo;
import com.gogohd.chat.mapper.ChatMapper;
import com.gogohd.chat.service.ChatService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.net.SocketTimeoutException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class ChatServiceImpl extends ServiceImpl<ChatMapper, Void> implements ChatService {
    private final OpenAiService openAiService = new
            OpenAiService("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", Duration.ofSeconds(60));

    private final String STUDENT_CHAT_PREFIX = "student-chat://";
    private final String STAFF_CHAT_PREFIX = "staff-chat://";

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    public String sendMessageForStudent(String userId, SendMessageVo sendMessageVo) {
        String message = sendMessageVo.getMessage();
        if (ObjectUtils.isEmpty(message)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The message is empty");
        }

        return sendMessageToChatGPT(STUDENT_CHAT_PREFIX + userId, message);
    }

    @Override
    public String sendMessageForStaff(String userId, SendMessageVo sendMessageVo) {
        String message = sendMessageVo.getMessage();
        if (ObjectUtils.isEmpty(message)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The message is empty");
        }

        return sendMessageToChatGPT(STAFF_CHAT_PREFIX + userId, message);
    }

    @Override
    public void deleteContext(boolean isStudent, String userId) {
        redisTemplate.delete(isStudent ? STUDENT_CHAT_PREFIX + userId : STAFF_CHAT_PREFIX + userId);
    }

    @Override
    public Object getContext(boolean isStudent, String userId) {
        ListOperations<String, String> listOps = redisTemplate.opsForList();
        List<String> context = listOps.range(isStudent ? STUDENT_CHAT_PREFIX + userId : STAFF_CHAT_PREFIX + userId,
                0, -1);
        if (context != null && context.size() > 0 && context.size() % 2 == 0) {
            List<Map<String, String>> result = new ArrayList<>();
            for (int i = 0; i < context.size(); i += 2) {
                Map<String, String> tmp = new HashMap<>();
                tmp.put("question", context.get(i));
                tmp.put("response", context.get(i + 1));
                result.add(tmp);
            }
            return result;
        }
        return new ArrayList<String>();
    }

    private String sendMessageToChatGPT(String contextKey, String message) {
        ListOperations<String, String> listOps = redisTemplate.opsForList();
        List<String> context = listOps.range(contextKey, 0, -1);

        List<ChatMessage> chatMessages = new ArrayList<>();

        // Add all the content in context to request
        if (context != null && context.size() > 0 && context.size() % 2 == 0) {
            int idx = 0;
            for (String msg: context) {
                ChatMessage prevMessage = new ChatMessage(idx % 2 == 0 ?
                        ChatMessageRole.USER.value() : ChatMessageRole.ASSISTANT.value(), msg);
                chatMessages.add(prevMessage);
                ++idx;
            }
        }

        // Add the new message to request
        ChatMessage userMessage = new ChatMessage(ChatMessageRole.USER.value(), message);
        chatMessages.add(userMessage);

        // Construct the request
        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(chatMessages)
                .maxTokens(2048)
                .build();

        // Get response
        ChatMessage response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage();

        if (context == null || context.size() == 0 || context.size() % 2 != 0) {
            redisTemplate.delete(contextKey);
        }
        listOps.rightPushAll(contextKey, message, response.getContent());
        redisTemplate.expire(contextKey, 3600, TimeUnit.SECONDS);

        return response.getContent();
    }
}
