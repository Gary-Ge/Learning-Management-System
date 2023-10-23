package com.gogohd.chat.controller;

import com.gogohd.base.utils.R;
import com.gogohd.chat.entity.vo.SendMessageVo;
import com.gogohd.chat.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "chat-bot", produces = {"application/json"})
@Tag(name = "ChatBot related apis")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/student/message/")
    @Operation(summary = "Send message to chat bot, student side")
    public R sendMessageForStudent(HttpServletRequest request, @RequestBody SendMessageVo sendMessageVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Send message to chat bot success and response returned").data("response",
                chatService.sendMessageForStudent(userId, sendMessageVo));
    }

    @PostMapping("/staff/message/")
    @Operation(summary = "Send message to chat bot, staff side")
    public R sendMessageForStaff(HttpServletRequest request, @RequestBody SendMessageVo sendMessageVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Send message to chat bot success and response returned").data("response",
                chatService.sendMessageForStaff(userId, sendMessageVo));
    }

    @DeleteMapping("student/messages/")
    @Operation(summary = "Delete context (which is, all the messages sent to and responded from the chat bot), " +
            "student side. Used to start a new conversation")
    public R deleteContextForStudent(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        chatService.deleteContext(true, userId);
        return R.success().message("Delete context success");
    }

    @DeleteMapping("staff/messages/")
    @Operation(summary = "Delete context (which is, all the messages sent to and responded from the chat bot), " +
            "staff side. Used to start a new conversation")
    public R deleteContextForStaff(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        chatService.deleteContext(false, userId);
        return R.success().message("Delete context success");
    }

    @GetMapping("/student/messages/")
    @Operation(summary = "Get the context, student side, used to recover the conversation")
    public R getContextForStudent(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get context success").data("context", chatService.getContext(true, userId));
    }

    @GetMapping("/staff/messages/")
    @Operation(summary = "Get the context, staff side, used to recover the conversation")
    public R getContextForStaff(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get context success").data("context",
                chatService.getContext(false, userId));
    }
}
