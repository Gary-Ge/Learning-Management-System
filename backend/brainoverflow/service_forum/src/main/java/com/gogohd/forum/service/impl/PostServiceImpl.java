package com.gogohd.forum.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.forum.entity.Category;
import com.gogohd.forum.entity.Post;
import com.gogohd.forum.entity.Reply;
import com.gogohd.forum.entity.vo.CreatePostVo;
import com.gogohd.forum.entity.vo.UpdatePostVo;
import com.gogohd.forum.mapper.CategoryMapper;
import com.gogohd.forum.mapper.PostMapper;
import com.gogohd.forum.mapper.ReplyMapper;
import com.gogohd.forum.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl extends ServiceImpl<PostMapper, Post> implements PostService {
    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ReplyMapper replyMapper;

    @Override
    public String createPost(String userId, String courseId, CreatePostVo createPostVo) {
        if (categoryMapper.selectStaffCountById(userId, courseId) == 0 &&
                categoryMapper.selectStudentCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY,
                    "You have no authority to create post in this course's forum");
        }

        // Check if this category exists and if this category is belonged to this course's forum
        String categoryId = createPostVo.getCategoryId();
        if (ObjectUtils.isEmpty(categoryId)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Category ID cannot be empty");
        }
        Category category = categoryMapper.selectById(categoryId);
        if (category == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "This category not exists");
        }
        if (!Objects.equals(category.getCourseId(), courseId)) {
            throw new BrainException(ResultCode.NOT_FOUND, "Current course's forum do not have this category");
        }

        // Check if the not null values are null
        String title = createPostVo.getTitle();
        String content = createPostVo.getContent();

        if (ObjectUtils.isEmpty(title)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Post title cannot be empty");
        }
        if (ObjectUtils.isEmpty(content)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Post content cannot be empty");
        }

        // Create a new post
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setPostBy(userId);
        post.setCourseId(courseId);
        post.setCategoryId(categoryId);

        if (baseMapper.insert(post) != 1) {
            throw new BrainException(ResultCode.ERROR, "Create post failed");
        }

        return post.getPostId();
    }

    @Override
    public void updatePost(String userId, String postId, UpdatePostVo updatePostVo) {
        Post post = baseMapper.selectById(postId);
        if (post == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Post not exist");
        }

        if (categoryMapper.selectStaffCountById(userId, post.getCourseId()) == 0 &&
                !Objects.equals(post.getPostBy(), userId)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to update this post");
        }

        // Check if this category exists and if this category is belonged to this course's forum
        String categoryId = updatePostVo.getCategoryId();
        if (ObjectUtils.isEmpty(categoryId)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Category ID cannot be empty");
        }
        Category category = categoryMapper.selectById(categoryId);
        if (category == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "This category not exists");
        }
        if (!Objects.equals(category.getCourseId(), post.getCourseId())) {
            throw new BrainException(ResultCode.NOT_FOUND, "Current course's forum do not have this category");
        }

        // Update this post
        Post update = new Post();
        update.setPostId(postId);
        update.setCategoryId(categoryId);
        update.setTitle(updatePostVo.getTitle());
        update.setContent(updatePostVo.getContent());

        if (baseMapper.updateById(update) != 1) {
            throw new BrainException(ResultCode.ERROR, "Update post failed");
        }
    }

    @Override
    @Transactional
    public void deletePost(String userId, String postId) {
        Post post = baseMapper.selectById(postId);
        if (post == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Post not exist");
        }
        if (categoryMapper.selectStaffCountById(userId, post.getCourseId()) == 0 &&
                !Objects.equals(post.getPostBy(), userId)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to delete this post");
        }

        // Delete all the replies under this post, if any
        LambdaQueryWrapper<Reply> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Reply::getPostId, postId);
        replyMapper.delete(wrapper);

        // Delete the post
        if (baseMapper.deleteById(postId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete post failed");
        }
    }

    @Override
    public List<Map<String, Object>> getPostListByCourseId(String userId, String courseId) {
        if (categoryMapper.selectStaffCountById(userId, courseId) == 0 &&
                categoryMapper.selectStudentCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY,
                    "You have no authority to get posts information of this course's forum");
        }

        return baseMapper.selectPostsWithPostersByCourseId(courseId).stream()
                .map(record -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("postId", record.get("post_id"));
                    result.put("title", record.get("title"));
                    result.put("content", record.get("content"));
                    result.put("createdAt", record.get("created_at"));
                    result.put("updatedAt", record.get("updated_at"));
                    result.put("category", record.get("category"));
                    result.put("color", record.get("color"));
                    result.put("categoryId", record.get("category_id"));

                    Map<String, Object> user = new HashMap<>();
                    user.put("userId", record.get("user_id"));
                    user.put("username", record.get("username"));
                    user.put("email", record.get("email"));
                    user.put("avatar", record.get("avatar"));

                    result.put("postBy", user);
                    return result;
                }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getPostListByCategoryId(String userId, String courseId, String categoryId) {
        if (categoryMapper.selectStaffCountById(userId, courseId) == 0 &&
                categoryMapper.selectStudentCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY,
                    "You have no authority to get posts information of this course's forum");
        }

        Category category = categoryMapper.selectById(categoryId);
        if (category == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Category not exists");
        }
        if (!Objects.equals(category.getCourseId(), courseId)) {
            throw new BrainException(ResultCode.NOT_FOUND, "Current course's forum do not have this category");
        }

        return baseMapper.selectPostsWithPostersByCategoryId(courseId, categoryId).stream()
                .map(record -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("postId", record.get("post_id"));
                    result.put("title", record.get("title"));
                    result.put("content", record.get("content"));
                    result.put("createdAt", record.get("created_at"));
                    result.put("updatedAt", record.get("updated_at"));
                    result.put("category", record.get("category"));
                    result.put("color", record.get("color"));
                    result.put("categoryId", record.get("category_id"));

                    Map<String, Object> user = new HashMap<>();
                    user.put("userId", record.get("user_id"));
                    user.put("username", record.get("username"));
                    user.put("email", record.get("email"));
                    user.put("avatar", record.get("avatar"));

                    result.put("postBy", user);
                    return result;
                }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getPostById(String userId, String postId) {
        Post post = baseMapper.selectById(postId);
        if (post == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Post not exist");
        }

        if (categoryMapper.selectStaffCountById(userId, post.getCourseId()) == 0 &&
                categoryMapper.selectStudentCountById(userId, post.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to get this post information");
        }
        Category category = categoryMapper.selectById(post.getCategoryId());

        Map<String, Object> result = new HashMap<>();
        result.put("postId", post.getPostId());
        result.put("title", post.getTitle());
        result.put("content", post.getContent());
        result.put("category", category.getName());
        result.put("color", category.getColor());
        result.put("categoryId", category.getCategoryId());
        result.put("createdAt", post.getCreatedAt());
        result.put("updatedAt", post.getUpdatedAt());

        Map<String, Object> user = baseMapper.selectUserById(post.getPostBy());
        user.remove("password");
        user.remove("created_at");
        user.remove("updated_at");

        result.put("postBy", user);

        List<String> sortedList = new ArrayList<>();
        Map<String, Map<String, Object>> firsts = new HashMap<>();
        Map<String, List<Map<String, Object>>> seconds = new HashMap<>();

        List<Map<String, Object>> maps = baseMapper.selectRepliesByPostId(postId);
        for (Map<String, Object> map: maps) {
            String firstId = (String) map.get("first_id");

            // If the parent reply is never visited
            if (!seconds.containsKey(firstId)) {
                Map<String, Object> first = new HashMap<>();

                first.put("replyId", firstId);
                first.put("content", map.get("first_content"));
                first.put("createdAt", map.get("first_created_at"));
                first.put("updatedAt", map.get("first_updated_at"));

                Map<String, Object> replyBy = new HashMap<>();
                replyBy.put("userId", map.get("first_user_id"));
                replyBy.put("username", map.get("first_username"));
                replyBy.put("email", map.get("first_email"));
                replyBy.put("avatar", map.get("first_avatar"));

                // Keep order
                sortedList.add(firstId);
                first.put("replyBy", replyBy);
                firsts.put(firstId, first);
                seconds.put(firstId, new ArrayList<>());
            }

            // If the parent reply has one child reply
            String secondId = (String) map.get("second_id");
            if (secondId != null) {
                Map<String, Object> second = new HashMap<>();
                second.put("replyId", map.get("second_id"));
                second.put("content", map.get("second_content"));
                second.put("createdAt", map.get("second_created_at"));
                second.put("updatedAt", map.get("second_updated_at"));

                Map<String, Object> replyBy = new HashMap<>();
                replyBy.put("userId", map.get("second_user_id"));
                replyBy.put("username", map.get("second_username"));
                replyBy.put("email", map.get("second_email"));
                replyBy.put("avatar", map.get("second_avatar"));

                second.put("replyBy", replyBy);

                if (map.get("to_user_id") != null) {
                    Map<String, Object> replyTo = new HashMap<>();
                    replyTo.put("userId", map.get("to_user_id"));
                    replyTo.put("username", map.get("to_username"));
                    replyTo.put("email", map.get("to_email"));
                    replyTo.put("avatar", map.get("to_avatar"));
                    second.put("replyTo", replyTo);
                } else {
                    seconds.put("replyTo", null);
                }

                seconds.get(firstId).add(second);
            }
        }

        // Construct the final result
        List<Map<String, Object>> replies = new ArrayList<>();
        for (String firstId: sortedList) {
            Map<String, Object> first = firsts.get(firstId);
            first.put("subReplies", seconds.get(firstId));
            replies.add(first);
        }

        result.put("replies", replies);

        return result;
    }

    @Override
    public Map<String, Object> searchPosts(String userId, String courseId, String keyword) {
        if (categoryMapper.selectStaffCountById(userId, courseId) == 0 &&
                categoryMapper.selectStudentCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY,
                    "You have no authority to search posts of this course's forum");
        }

        Set<String> visited = new HashSet<>();
        Map<String, Object> finalResult = new HashMap<>();

        finalResult.put("inTitle", baseMapper.selectPostsWithKeywordInTitle(courseId, keyword).stream()
                .map(record -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("postId", record.get("post_id"));
                    result.put("title", record.get("title"));
                    result.put("content", record.get("content"));
                    result.put("createdAt", record.get("created_at"));
                    result.put("updatedAt", record.get("updated_at"));
                    result.put("category", record.get("category"));
                    result.put("color", record.get("color"));
                    result.put("categoryId", record.get("category_id"));

                    Map<String, Object> user = new HashMap<>();
                    user.put("userId", record.get("user_id"));
                    user.put("username", record.get("username"));
                    user.put("email", record.get("email"));
                    user.put("avatar", record.get("avatar"));

                    result.put("postBy", user);

                    visited.add((String) record.get("post_id"));
                    return result;
                }).collect(Collectors.toList()));

        finalResult.put("inContent", baseMapper.selectPostsWithKeywordInContent(courseId, keyword).stream()
                .filter(record -> {
                    String id = (String) record.get("post_id");
                    String textContent = ((String) record.get("content")).replaceAll("<.*?>", "");
                    return !visited.contains(id) && textContent.toUpperCase().contains(keyword.toUpperCase());
                })
                .map(record -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("postId", record.get("post_id"));
                    result.put("title", record.get("title"));
                    result.put("content", record.get("content"));
                    result.put("createdAt", record.get("created_at"));
                    result.put("updatedAt", record.get("updated_at"));
                    result.put("category", record.get("category"));
                    result.put("color", record.get("color"));
                    result.put("categoryId", record.get("category_id"));

                    Map<String, Object> user = new HashMap<>();
                    user.put("userId", record.get("user_id"));
                    user.put("username", record.get("username"));
                    user.put("email", record.get("email"));
                    user.put("avatar", record.get("avatar"));

                    result.put("postBy", user);
                    return result;
                }).collect(Collectors.toList()));

        return finalResult;
    }
}
