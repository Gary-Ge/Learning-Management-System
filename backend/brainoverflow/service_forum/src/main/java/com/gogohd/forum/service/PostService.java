package com.gogohd.forum.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.forum.entity.Post;
import com.gogohd.forum.entity.vo.CreatePostVo;
import com.gogohd.forum.entity.vo.UpdatePostVo;

import java.util.List;
import java.util.Map;

public interface PostService extends IService<Post> {
    String createPost(String userId, String courseId, CreatePostVo createPostVo);

    void updatePost(String userId, String postId, UpdatePostVo updatePostVo);

    void deletePost(String userId, String postId);

    List<Map<String, Object>> getPostListByCourseId(String userId, String courseId);

    List<Map<String, Object>> getPostListByCategoryId(String userId, String courseId, String categoryId);

    Map<String, Object> getPostById(String userId, String postId);
}
