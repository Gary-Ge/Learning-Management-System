package com.gogohd.chat.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.chat.entity.vo.SendMessageVo;

public interface ChatService extends IService<Void> {

    String sendMessageForStudent(String userId, SendMessageVo sendMessageVo);

    String sendMessageForStaff(String userId, SendMessageVo sendMessageVo);

    void deleteContext(boolean isStudent, String userId);

    Object getContext(boolean isStudent, String userId);
}
