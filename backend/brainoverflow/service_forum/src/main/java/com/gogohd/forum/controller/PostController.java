package com.gogohd.forum.controller;

import com.gogohd.base.utils.R;
import com.gogohd.forum.entity.vo.CreatePostVo;
import com.gogohd.forum.entity.vo.UpdatePostVo;
import com.gogohd.forum.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("forum-post")
@Tag(name = "Post related APIs")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("post/{courseId}")
    @Operation(summary = "Create a post in one course's forum with specific category")
    public R createPost(HttpServletRequest request, @PathVariable String courseId,
                        @RequestBody CreatePostVo createPostVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Create post success").data("postId",
                postService.createPost(userId, courseId, createPostVo));
    }

    @PutMapping("post/{postId}")
    @Operation(summary = "Update a post")
    public R updatePost(HttpServletRequest request, @PathVariable String postId,
                        @RequestBody UpdatePostVo updatePostVo) {
        String userId = (String) request.getAttribute("userId");
        postService.updatePost(userId, postId, updatePostVo);
        return R.success().message("Update post success");
    }

    @DeleteMapping("post/{postId}")
    @Operation(summary = "Delete a post")
    public R deletePost(HttpServletRequest request, @PathVariable String postId) {
        String userId = (String) request.getAttribute("userId");
        postService.deletePost(userId, postId);
        return R.success().message("Delete post success");
    }

    @GetMapping("posts/{courseId}")
    @Operation(summary = "Get all the posts information of a course's forum, replies not included")
    public R getPosts(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get all the posts information success").data("posts",
                postService.getPostListByCourseId(userId, courseId));
    }

    @GetMapping("posts/{courseId}/{categoryId}")
    @Operation(summary = "Get all the posts information of a course's forum with specific category," +
            "replies not included")
    public R getPostsByCategory(HttpServletRequest request, @PathVariable String courseId,
                                @PathVariable String categoryId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get posts information success").data("posts",
                postService.getPostListByCategoryId(userId, courseId, categoryId));
    }

    @GetMapping("post/{postId}")
    @Operation(summary = "Get one post information, including all replies")
    public R getPost(HttpServletRequest request, @PathVariable String postId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get post information success").data("post",
                postService.getPostById(userId, postId));
    }

    @GetMapping("posts/{courseId}/search/{keyword}")
    @Operation(summary = "Search all the posts with keyword in title or content")
    public R searchPost(HttpServletRequest request, @PathVariable String courseId, @PathVariable String keyword) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Search post success").data("posts",
                postService.searchPosts(userId, courseId, keyword));
    }
}
