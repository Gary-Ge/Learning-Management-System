package com.gogohd.forum.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.forum.entity.Reply;
import com.gogohd.forum.entity.vo.CreateReplyVo;
import com.gogohd.forum.entity.vo.UpdateReplyVo;

public interface ReplyService extends IService<Reply> {
    String replyToPost(String userId, String postId, CreateReplyVo createReplyVo);

    String replyToReply(String userId, String replyId, CreateReplyVo createReplyVo);

    void updateReply(String userId, String replyId, UpdateReplyVo updateReplyVo);

    void deleteReply(String userId, String replyId);
}
