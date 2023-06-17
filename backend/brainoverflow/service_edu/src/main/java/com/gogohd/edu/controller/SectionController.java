package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateTextSectionVo;
import com.gogohd.edu.entity.vo.UpdateTextSectionVo;
import com.gogohd.edu.service.SectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("edu-section")
@Tag(name = "Section related APIs")
public class SectionController {

    @Autowired
    private SectionService sectionService;

    @Operation(summary = "Create a text section for a course")
    @PostMapping("textSection/{courseId}")
    public R createTextSection(HttpServletRequest request, @PathVariable String courseId,
                               @RequestBody CreateTextSectionVo createTextSectionVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Create text section success").data("sectionId",
                sectionService.createTextSection(userId, courseId, createTextSectionVo));
    }

    @Operation(summary = "Update a text section")
    @PutMapping("textSection/{sectionId}")
    public R updateTextSection(HttpServletRequest request, @PathVariable String sectionId,
                               @RequestBody UpdateTextSectionVo updateTextSectionVo) {
        String userId = (String) request.getAttribute("userId");
        sectionService.updateTextSectionById(userId, sectionId, updateTextSectionVo);
        return R.success().message("Update text section success");
    }

    @Operation(summary = "Get one text section info")
    @GetMapping("textSection/{sectionId}")
    public R getTextSection(HttpServletRequest request, @PathVariable String sectionId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get text section information success").data("section",
                sectionService.getTextSectionById(userId, sectionId));
    }

    @Operation(summary = "Delete a section")
    @DeleteMapping("section/{sectionId}")
    public R deleteSection(HttpServletRequest request, @PathVariable String sectionId) {
        String userId = (String) request.getAttribute("userId");
        sectionService.deleteSection(userId, sectionId);
        return R.success().message("Delete section success");
    }
}