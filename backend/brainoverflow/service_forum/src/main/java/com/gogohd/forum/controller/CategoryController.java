package com.gogohd.forum.controller;

import com.gogohd.base.utils.R;
import com.gogohd.forum.entity.vo.CreateCategoryVo;
import com.gogohd.forum.entity.vo.UpdateCategoryVo;
import com.gogohd.forum.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("forum-category")
@Tag(name = "APIs related to post categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/category/{courseId}")
    @Operation(summary = "Create a category of post for one course's forum")
    public R createCategory(HttpServletRequest request, @PathVariable String courseId,
                            @RequestBody CreateCategoryVo createCategoryVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Create category success").data("categoryId",
                categoryService.createCategory(userId, courseId, createCategoryVo));
    }

    @PutMapping("/category/{categoryId}")
    @Operation(summary = "Update a category")
    public R updateCategory(HttpServletRequest request, @PathVariable String categoryId,
                            @RequestBody UpdateCategoryVo updateCategoryVo) {
        String userId = (String) request.getAttribute("userId");
        categoryService.updateCategory(userId, categoryId, updateCategoryVo);
        return R.success().message("Update category success");
    }

    @DeleteMapping("/category/{categoryId}")
    @Operation(summary = "Delete a category")
    public R deleteCategory(HttpServletRequest request, @PathVariable String categoryId) {
        String userId = (String) request.getAttribute("userId");
        categoryService.deleteCategory(userId, categoryId);
        return R.success().message("Delete category success");
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get one category info")
    public R getCategory(HttpServletRequest request, @PathVariable String categoryId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get categories success").data("category",
                categoryService.getCategoryById(userId, categoryId));
    }

    @GetMapping("/categories/{courseId}")
    @Operation(summary = "Get all the categories of one course's forum")
    public R getCategories(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get categories success").data("categories",
                categoryService.getCategoryListByCourseId(userId, courseId));
    }
}
