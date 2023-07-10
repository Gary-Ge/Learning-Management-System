package com.gogohd.forum.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.forum.entity.Post;
import com.gogohd.forum.entity.Reply;
import com.gogohd.forum.entity.vo.CreateReplyVo;
import com.gogohd.forum.entity.vo.UpdateReplyVo;
import com.gogohd.forum.mapper.PostMapper;
import com.gogohd.forum.mapper.ReplyMapper;
import com.gogohd.forum.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.Objects;

@Service
public class ReplyServiceImpl extends ServiceImpl<ReplyMapper, Reply> implements ReplyService {
    @Autowired
    private PostMapper postMapper;
    @Override
    public String replyToPost(String userId, String postId, CreateReplyVo createReplyVo) {
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Post not exist");
        }

        if (baseMapper.selectStaffCountById(userId, post.getCourseId()) == 0 &&
                baseMapper.selectStudentCountById(userId, post.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to reply to this post");
        }

        String content = createReplyVo.getContent();
        if (ObjectUtils.isEmpty(content)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Reply content cannot be empty");
        }

        // Add a new reply
        Reply reply = new Reply();
        reply.setReplyBy(userId);
        reply.setPostId(postId);
        reply.setContent(content);

        if (baseMapper.insert(reply) != 1) {
            throw new BrainException(ResultCode.ERROR, "Reply to post failed");
        }
        return reply.getReplyId();
    }

    @Override
    public String replyToReply(String userId, String replyId, CreateReplyVo createReplyVo) {
        Reply reply = baseMapper.selectById(replyId);
        if (reply == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Reply not exist");
        }

        Post post = postMapper.selectById(reply.getPostId());
        if (baseMapper.selectStaffCountById(userId, post.getCourseId()) == 0 &&
                baseMapper.selectStudentCountById(userId, post.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to reply to this reply");
        }

        String content = createReplyVo.getContent();
        if (ObjectUtils.isEmpty(content)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Reply content cannot be empty");
        }

        // Add a new reply
        Reply create = new Reply();
        create.setReplyBy(userId);
        create.setPostId(reply.getPostId());
        create.setContent(content);

        // If the reply to be replied do not have a parent ID, then that reply is a level 1 reply
        // (a reply replying to the post itself).
        // If the reply to be replied do have a parent ID, then that reply is a level 2 reply
        // (a reply replying to a level 1 reply)
        // If you are replying to a level 2 reply, reply_to must be set
        if (reply.getParentId() != null) {
            create.setParentId(reply.getParentId());
            create.setReplyTo(reply.getReplyBy());
        } else {
            create.setParentId(replyId);
        }

        if (baseMapper.insert(create) != 1) {
            throw new BrainException(ResultCode.ERROR, "Reply to reply failed");
        }

        return create.getReplyId();
    }

    @Override
    public void updateReply(String userId, String replyId, UpdateReplyVo updateReplyVo) {
        Reply reply = baseMapper.selectById(replyId);
        if (reply == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Reply not exist");
        }

        Post post = postMapper.selectById(reply.getPostId());
        if (baseMapper.selectStaffCountById(userId, post.getCourseId()) == 0 &&
                !Objects.equals(reply.getReplyBy(), userId)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to update this reply");
        }

        Reply update = new Reply();
        update.setReplyId(replyId);
        update.setContent(updateReplyVo.getContent());

        if (baseMapper.updateById(update) != 1) {
            throw new BrainException(ResultCode.ERROR, "Update reply failed");
        }
    }

    @Override
    @Transactional
    public void deleteReply(String userId, String replyId) {
        Reply reply = baseMapper.selectById(replyId);
        if (reply == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Reply not exist");
        }

        Reply parent = reply.getParentId() == null ? null : baseMapper.selectById(reply.getParentId());

        Post post = postMapper.selectById(reply.getPostId());
        if (baseMapper.selectStaffCountById(userId, post.getCourseId()) == 0 &&
                !Objects.equals(reply.getReplyBy(), userId) && !Objects.equals(post.getPostBy(), userId) &&
                parent != null && !Objects.equals(parent.getReplyBy(), userId)) {
            // If this user is neither the replier nor the staff of this course nor the poster of this post nor
            // the replier of the parent reply (if any), then error
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to update this reply");
        }

        // Delete all the sub replies of this reply (if any)
        LambdaQueryWrapper<Reply> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Reply::getParentId, replyId);
        baseMapper.delete(wrapper);

        // Delete this reply
        if (baseMapper.deleteById(replyId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete reply failed");
        }
    }
}
