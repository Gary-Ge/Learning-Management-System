package com.gogohd.stream.controller;

import com.gogohd.base.utils.R;
import com.gogohd.stream.service.ChatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("stream-chat")
@Tag(name = "APIs related to chat during stream")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping("message/{streamId}/{message}")
    public R sendMessage(HttpServletRequest request, @PathVariable String streamId, @PathVariable String message) {
        String userId = (String) request.getAttribute("userId");
        String token = request.getHeader("Authorization");
        chatService.sendMessage(userId, token, streamId, message);
        return R.success().message("Send message success");
    }
}
