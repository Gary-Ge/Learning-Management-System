package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Category;

public interface CategoryService extends IService<Category> {
    String createCategory(String categoryName, String userId);
}
