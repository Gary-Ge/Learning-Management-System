package com.gogohd.forum.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.forum.entity.Category;
import com.gogohd.forum.entity.vo.CreateCategoryVo;
import com.gogohd.forum.entity.vo.UpdateCategoryVo;

import java.util.List;
import java.util.Map;

public interface CategoryService extends IService<Category> {
    String createCategory(String userId, String courseId, CreateCategoryVo createCategoryVo);

    void updateCategory(String userId, String categoryId, UpdateCategoryVo updateCategoryVo);

    void deleteCategory(String userId, String categoryId);

    List<Map<String, Object>> getCategoryListByCourseId(String userId, String courseId);

    Map<String, Object> getCategoryById(String userId, String categoryId);
}
