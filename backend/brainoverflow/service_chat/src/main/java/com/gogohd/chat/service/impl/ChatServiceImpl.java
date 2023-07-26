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

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class ChatServiceImpl extends ServiceImpl<ChatMapper, Void> implements ChatService {
    private final OpenAiService openAiService = new
            OpenAiService("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", Duration.ofSeconds(60));

    private final String STUDENT_CHAT_PREFIX = "student-chat://";
    private final String STAFF_CHAT_PREFIX = "staff-chat://";

    private final String INFO = "MYINFO";
    private final String DEADLINE = "DEADLINE";
    private final String DEADLINES = "DEADLINES";
    private final String DUE = "DUE";
    private final String UPDATE = "UPDATE";
    private final String SEARCH = "SEARCH";

    private final String HOST = "localhost:8000";
    private final String COURSE_URL = "/studentcourse?courseid=";

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    public String sendMessageForStudent(String userId, SendMessageVo sendMessageVo) {
        String message = sendMessageVo.getMessage();
        if (ObjectUtils.isEmpty(message)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The message is empty");
        }

        String messageUniform = message.toUpperCase();

        if (messageUniform.equals(INFO)) {
            return getMyInfo(userId);
        } else if (messageUniform.equals(DEADLINE) || messageUniform.equals(DEADLINES) || messageUniform.equals(DUE)) {
            return getDeadlines(userId);
        } else if (messageUniform.equals(UPDATE)) {
            return getUpdate(userId);
        } else if (messageUniform.startsWith(SEARCH)) {
            return searchCourses(userId, messageUniform.substring(6).trim());
        }

        return sendMessageToChatGPT(STUDENT_CHAT_PREFIX + userId, message);
    }

    @Override
    public String sendMessageForStaff(String userId, SendMessageVo sendMessageVo) {
        String message = sendMessageVo.getMessage();
        if (ObjectUtils.isEmpty(message)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The message is empty");
        }

        String messageUniform = message.toUpperCase();

        if (messageUniform.equals(INFO)) {
            return getMyInfo(userId);
        } else if (messageUniform.equals(DEADLINE) || messageUniform.equals(DEADLINES) || messageUniform.equals(DUE)) {
            return getDeadlinesForStaff(userId);
        } else if (messageUniform.equals(UPDATE)) {
            return getUpdateForStaff(userId);
        } else if (messageUniform.startsWith(SEARCH)) {
            return searchCourses(userId, messageUniform.substring(6).trim());
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

    private String getMyInfo(String userId) {
        Map<String, Object> userInfo = baseMapper.selectUserById(userId);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");

        return "Your user information is:<br/><br/>Username: " + userInfo.get("username") +
                "<br/>Email Address: " + userInfo.get("email") + "<br/>You created this account on: " +
                simpleDateFormat.format(userInfo.get("created_at"));
    }

    private String getDeadlines(String userId) {
        StringBuffer sb = new StringBuffer();
        sb.append("The deadlines for each course you have enrolled in are:<br/><br/>");

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        List<Map<String, Object>> assignments = baseMapper.selectAssignmentsByUserId(userId);
        List<Map<String, Object>> quizzes = baseMapper.selectQuizzesByUserId(userId);

        List<Map<String, Object>> total = new ArrayList<>();

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        assignments.forEach(assignment -> {
            assignment.put("type", "Assignment");
            if (((Timestamp) assignment.get("end")).after(now)) {
                total.add(assignment);
            }
        });
        quizzes.forEach(quiz -> {
            quiz.put("type", "Quiz");
            if (((Timestamp) quiz.get("end")).after(now)) {
                total.add(quiz);
            }
        });

        if (total.size() == 0) {
            return "There is no deadline for all the course you are enrolled in";
        }

        total.sort(Comparator.comparing((Map<String, Object> m) -> simpleDateFormat.format(m.get("end"))));
        total.forEach(item -> {
            sb.append("Type: ").append(item.get("type")).append("<br/>");
            sb.append("Course Name: ").append(item.get("course_title")).append("<br/>");
            sb.append("Event Name: ").append(item.get("event_title")).append("<br/>");
            sb.append("Deadline: ").append(simpleDateFormat.format(item.get("end"))).append("<br/><br/>");
        });

        return sb.toString();
    }

    private String getDeadlinesForStaff(String userId) {
        StringBuffer sb = new StringBuffer();
        sb.append("The deadlines for each course you are teaching are:<br/><br/>");

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        List<Map<String, Object>> assignments = baseMapper.selectAssignmentsByUserIdForStaff(userId);
        List<Map<String, Object>> quizzes = baseMapper.selectQuizzesByUserIdForStaff(userId);

        List<Map<String, Object>> total = new ArrayList<>();

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        assignments.forEach(assignment -> {
            assignment.put("type", "Assignment");
            if (((Timestamp) assignment.get("end")).after(now)) {
                total.add(assignment);
            }
        });
        quizzes.forEach(quiz -> {
            quiz.put("type", "Quiz");
            if (((Timestamp) quiz.get("end")).after(now)) {
                total.add(quiz);
            }
        });

        if (total.size() == 0) {
            return "There is no deadline for all the course you are teaching";
        }

        total.sort(Comparator.comparing((Map<String, Object> m) -> simpleDateFormat.format(m.get("end"))));
        total.forEach(item -> {
            sb.append("Type: ").append(item.get("type")).append("<br/>");
            sb.append("Course Name: ").append(item.get("course_title")).append("<br/>");
            sb.append("Event Name: ").append(item.get("event_title")).append("<br/>");
            sb.append("Deadline: ").append(simpleDateFormat.format(item.get("end"))).append("<br/><br/>");
        });

        return sb.toString();
    }

    private String getUpdate(String userId) {
        StringBuffer sb = new StringBuffer();
        sb.append("The most recent updating for each course you have enrolled in are:<br/><br/>");

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        AtomicReference<Boolean> hasUpdate = new AtomicReference<>(false);
        baseMapper.selectEnrolledCoursesByUserId(userId)
                .forEach(course -> {
                    Map<String, Object> section =
                            baseMapper.selectMostRecentSectionByCourseId((String) course.get("cid"));
                    if (section != null) {
                        sb.append("Course Name: ").append(course.get("title")).append("<br/>");
                        sb.append("Recently Updated Section: ").append(section.get("title")).append("<br/>");
                        sb.append("Updated At: ").append(simpleDateFormat.format(section.get("updated_at")))
                                .append("<br/>");
                        sb.append("Link: ").append(HOST).append(COURSE_URL).append(course.get("cid")).append("<br/><br/>");
                        hasUpdate.set(true);
                    }
                });

        if (!hasUpdate.get()) {
            return "There is no recent update for all the courses you are enrolled in";
        }

        return sb.toString();
    }
    private String getUpdateForStaff(String userId) {
        StringBuffer sb = new StringBuffer();
        sb.append("The most recent updating for each course you are teaching are:<br/><br/>");

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        AtomicReference<Boolean> hasUpdate = new AtomicReference<>(false);
        baseMapper.selectStaffedCoursesByUserId(userId)
                .forEach(course -> {
                    Map<String, Object> section =
                            baseMapper.selectMostRecentSectionByCourseId((String) course.get("cid"));
                    if (section != null) {
                        sb.append("Course Name: ").append(course.get("title")).append("<br/>");
                        sb.append("Recently Updated Section: ").append(section.get("title")).append("<br/>");
                        sb.append("Updated At: ").append(simpleDateFormat.format(section.get("updated_at")))
                                .append("<br/>");
                        sb.append("Link: ").append(HOST).append(COURSE_URL).append(course.get("cid")).append("<br/><br/>");
                        hasUpdate.set(true);
                    }
                });

        if (!hasUpdate.get()) {
            return "There is no recent update for all the courses you are teaching";
        }

        return sb.toString();
    }


    private String searchCourses(String userId, String keyword) {
        List<Map<String, Object>> courses = baseMapper.searchCoursesByKeyword(userId, keyword);
        if (courses.size() == 0) {
            return "There is no course related to \"" + keyword + "\"";
        }

        StringBuffer sb = new StringBuffer();
        sb.append("The courses related to \"").append(keyword).append("\" are:<br/><br/>");

        courses.forEach(course -> {
                    sb.append("Course Name: ").append(course.get("title")).append("<br/>");
                    sb.append("Course Category: ").append(course.get("category_name")).append("<br/>");
                    sb.append("Course Description: ").append(course.get("description")).append("<br/>");
                    sb.append("Course Creator: ").append(course.get("username")).append("<br/><br/>");
                });

        return sb.toString();
    }
}
