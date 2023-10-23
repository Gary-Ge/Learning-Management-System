package com.gogohd.stream.service;

import com.baomidou.mybatisplus.extension.service.IService;

public interface ChatService {
    void sendMessage(String userId, String token, String streamId, String message);
}
