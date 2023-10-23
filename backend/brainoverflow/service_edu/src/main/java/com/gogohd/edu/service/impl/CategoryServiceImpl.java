package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Category;
import com.gogohd.edu.mapper.CategoryMapper;
import com.gogohd.edu.service.CategoryService;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {
    @Override
    public String createCategory(String categoryName, String userId) {
        // Construct a new category object
        Category category = new Category();
        category.setCategoryName(categoryName);
        category.setCreatedBy(userId);

        // Insert to data table
        if (!save(category)) {
            throw new BrainException(ResultCode.ERROR, "Create category failed");
        }
        return category.getCategoryId();
    }
}
