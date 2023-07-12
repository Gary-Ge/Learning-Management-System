package com.gogohd.forum.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.forum.entity.Category;
import com.gogohd.forum.entity.Post;
import com.gogohd.forum.entity.vo.CreateCategoryVo;
import com.gogohd.forum.entity.vo.UpdateCategoryVo;
import com.gogohd.forum.mapper.CategoryMapper;
import com.gogohd.forum.mapper.PostMapper;
import com.gogohd.forum.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Autowired
    private PostMapper postMapper;

    @Override
    public String createCategory(String userId, String courseId, CreateCategoryVo createCategoryVo) {
        if (baseMapper.selectStaffCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create category for this forum");
        }

        String name = createCategoryVo.getName();
        if (ObjectUtils.isEmpty(name)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The category name cannot be empty");
        }

        String color = createCategoryVo.getColor();
        if (ObjectUtils.isEmpty(color)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The category color cannot be empty");
        }

        // Check if this category name exists
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getName, name);
        wrapper.eq(Category::getCourseId, courseId);
        if (baseMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.ERROR, "This category already exist, please use another category name");
        }

        // Create a new category
        Category category = new Category();
        category.setName(name);
        category.setColor(color);
        category.setCourseId(courseId);

        if (baseMapper.insert(category) != 1) {
            throw new BrainException(ResultCode.ERROR, "Create category failed");
        }

        return category.getCategoryId();
    }

    @Override
    public void updateCategory(String userId, String categoryId, UpdateCategoryVo updateCategoryVo) {
        Category category = baseMapper.selectById(categoryId);
        if (category == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Category not exist");
        }
        if (baseMapper.selectStaffCountById(userId, category.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to update this category");
        }

        // If the name is updated, check if this category exists
        String name = updateCategoryVo.getName();
        if (!ObjectUtils.isEmpty(name)) {
            LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Category::getName, name);
            wrapper.ne(Category::getCategoryId, categoryId);
            wrapper.eq(Category::getCourseId, category.getCourseId());
            if (baseMapper.exists(wrapper)) {
                throw new BrainException(ResultCode.ERROR,
                        "This category already exist, please use another category name");
            }
        }

        // Update the category
        Category update = new Category();
        update.setName(updateCategoryVo.getName());
        update.setCategoryId(categoryId);

        if (baseMapper.updateById(update) != 1) {
            throw new BrainException(ResultCode.ERROR, "Update category failed");
        }
    }

    @Override
    public void deleteCategory(String userId, String categoryId) {
        Category category = baseMapper.selectById(categoryId);
        if (category == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Category not exist");
        }
        if (baseMapper.selectStaffCountById(userId, category.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to delete this category");
        }
        // Check if there are posts under this category
        LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Post::getCategoryId, categoryId);
        List<Post> posts = postMapper.selectList(wrapper);
        if (posts.size() > 0) {
            throw new BrainException(ResultCode.ERROR,
                    "You cannot delete this category since there are posts under this category");
        }

        // Delete this category
        if (baseMapper.deleteById(categoryId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete category failed");
        }
    }

    @Override
    public List<Map<String, Object>> getCategoryListByCourseId(String userId, String courseId) {
        if (baseMapper.selectStaffCountById(userId, courseId) == 0 &&
                baseMapper.selectStudentCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY,
                    "You have no authority to get categories information of this course's forum");
        }
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getCourseId, courseId);
        wrapper.orderByAsc(Category::getName);
        return baseMapper.selectList(wrapper).stream()
                .map(category -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("categoryId", category.getCategoryId());
                    result.put("name", category.getName());
                    result.put("createdAt", category.getCreatedAt());
                    result.put("updatedAt", category.getUpdatedAt());
                    result.put("color", category.getColor());

                    return result;
                }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getCategoryById(String userId, String categoryId) {
        Category category = baseMapper.selectById(categoryId);
        if (category == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Category not exists");
        }
        if (baseMapper.selectStaffCountById(userId, category.getCourseId()) == 0 &&
                baseMapper.selectStudentCountById(userId, category.getCategoryId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY,
                    "You have no authority to get this category information");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("categoryId", category.getCategoryId());
        result.put("name", category.getName());
        result.put("createdAt", category.getCreatedAt());
        result.put("updatedAt", category.getUpdatedAt());
        result.put("color", category.getColor());

        return result;
    }
}
