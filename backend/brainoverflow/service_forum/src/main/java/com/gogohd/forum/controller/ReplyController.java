package com.gogohd.forum.controller;

import com.gogohd.base.utils.R;
import com.gogohd.forum.entity.vo.CreateReplyVo;
import com.gogohd.forum.entity.vo.UpdateReplyVo;
import com.gogohd.forum.service.ReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("forum-reply")
@Tag(name = "Reply related APIs")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    @PostMapping("post/{postId}/reply")
    @Operation(summary = "Reply to a post")
    public R replyToPost(HttpServletRequest request, @PathVariable String postId,
                         @RequestBody CreateReplyVo createReplyVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Reply to post success").data("replyId",
                replyService.replyToPost(userId, postId, createReplyVo));
    }

    @PostMapping("reply/{replyId}/reply")
    @Operation(summary = "Reply to a reply")
    public R replyToReply(HttpServletRequest request, @PathVariable String replyId,
                          @RequestBody CreateReplyVo createReplyVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Reply to reply success").data("replyId",
                replyService.replyToReply(userId, replyId, createReplyVo));
    }

    @PutMapping("reply/{replyId}")
    @Operation(summary = "Update a reply")
    public R updateReply(HttpServletRequest request, @PathVariable String replyId,
                         @RequestBody UpdateReplyVo updateReplyVo) {
        String userId = (String) request.getAttribute("userId");
        replyService.updateReply(userId, replyId, updateReplyVo);
        return R.success().message("Update reply success");
    }

    @DeleteMapping("reply/{replyId}")
    @Operation(summary = "Delete a reply")
    public R deleteReply(HttpServletRequest request, @PathVariable String replyId) {
        String userId = (String) request.getAttribute("userId");
        replyService.deleteReply(userId, replyId);
        return R.success().message("Delete reply success");
    }
}
