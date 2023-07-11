package com.gogohd.forum.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gogohd.forum.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface PostMapper extends BaseMapper<Post> {
    @Select("select post_id, title, content, POSTS.created_at as created_at, POSTS.updated_at as updated_at," +
            "name as category, color, user_id, username, email, avatar from POSTS left join POST_CATEGORIES on " +
            "POSTS.category_id=POST_CATEGORIES.category_id left join USERS on POSTS.post_by=USERS.user_id where " +
            "POSTS.course_id=#{courseId} order by created_at desc")
    List<Map<String, Object>> selectPostsWithPostersByCourseId(@Param("courseId") String courseId);

    @Select("select post_id, title, content, POSTS.created_at as created_at, POSTS.updated_at as updated_at," +
            "name as category, color, user_id, username, email, avatar from POSTS left join POST_CATEGORIES on " +
            "POSTS.category_id=POST_CATEGORIES.category_id left join USERS on POSTS.post_by=USERS.user_id where " +
            "POSTS.course_id=#{courseId} and POSTS.category_id=#{categoryId} order by created_at desc")
    List<Map<String, Object>> selectPostsWithPostersByCategoryId(@Param("courseId") String courseId,
                                                                 @Param("categoryId") String categoryId);
    @Select("select post_id, title, content, POSTS.created_at as created_at, POSTS.updated_at as updated_at," +
            "name as category, color, user_id, username, email, avatar from POSTS left join POST_CATEGORIES on " +
            "POSTS.category_id=POST_CATEGORIES.category_id left join USERS on POSTS.post_by=USERS.user_id where " +
            "POSTS.course_id=#{courseId} and title like CONCAT('%', #{keyword}, '%') order by created_at desc")
    List<Map<String, Object>> selectPostsWithKeywordInTitle(@Param("courseId") String courseId,
                                                            @Param("keyword") String keyword);

    @Select("select post_id, title, content, POSTS.created_at as created_at, POSTS.updated_at as updated_at," +
            "name as category, color, user_id, username, email, avatar from POSTS left join POST_CATEGORIES on " +
            "POSTS.category_id=POST_CATEGORIES.category_id left join USERS on POSTS.post_by=USERS.user_id where " +
            "POSTS.course_id=#{courseId} and content like CONCAT('%', #{keyword}, '%') order by created_at desc")
    List<Map<String, Object>> selectPostsWithKeywordInContent(@Param("courseId") String courseId,
                                                              @Param("keyword") String keyword);

    @Select("SELECT first.reply_id as first_id, first.content as first_content, first.created_at as first_created_at, " +
            "first.updated_at as first_updated_at, u1.user_id as first_user_id, u1.username as first_username, " +
            "u1.email as first_email, u1.avatar as first_avatar, second.reply_id as second_id, " +
            "second.content as second_content, second.created_at as second_created_at, " +
            "second.updated_at as second_updated_at, u2.user_id as second_user_id, " +
            "u2.username as second_username, u2.email as second_email, u2.avatar as second_avatar, " +
            "u3.user_id as to_user_id, u3.username as to_username, u3.email as to_email, u3.avatar as to_avatar " +
            "FROM REPLIES AS first " +
            "LEFT JOIN REPLIES AS second ON first.reply_id = second.parent_id left join USERS u1 on " +
            "first.reply_by = u1.user_id left join USERS u2 on second.reply_by = u2.user_id left join USERS u3 on " +
            "second.reply_to = u3.user_id where first.parent_id IS NULL and first.post_id=#{postId}" +
            "ORDER BY first.created_at, second.created_at;")
    List<Map<String, Object>> selectRepliesByPostId(@Param("postId") String postId);

    @Select("SELECT * from USERS where user_id=#{userId}")
    Map<String, Object> selectUserById(@Param("userId") String userId);
}
