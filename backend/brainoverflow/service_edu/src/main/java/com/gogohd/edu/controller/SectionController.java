package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.entity.vo.CreateTextSectionVo;
import com.gogohd.edu.entity.vo.CreateVideoSectionVo;
import com.gogohd.edu.entity.vo.UpdateTextSectionVo;
import com.gogohd.edu.entity.vo.UpdateVideoSectionVo;
import com.gogohd.edu.service.SectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @Operation(summary = "Delete a section")
    @DeleteMapping("section/{sectionId}")
    public R deleteSection(HttpServletRequest request, @PathVariable String sectionId) {
        String userId = (String) request.getAttribute("userId");
        sectionService.deleteSection(userId, sectionId);
        return R.success().message("Delete section success");
    }

    @Operation(summary = "Create a video section")
    @PostMapping("videoSection/{courseId}")
    public R createVideoSection(HttpServletRequest request, @PathVariable String courseId,
                                @RequestBody CreateVideoSectionVo createVideoSectionVo) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Create video section success").data("sectionId",
                sectionService.createVideoSection(userId, courseId, createVideoSectionVo));
    }

    @Operation(summary = "Update a video section. It's okay to change a custom video section to a YouTube video " +
            "section, but the uploaded custom videos will be deleted if the user do this.")
    @PutMapping("videoSection/{sectionId}")
    public R updateVideoSection(HttpServletRequest request, @PathVariable String sectionId,
                                @RequestBody UpdateVideoSectionVo updateVideoSectionVo) {
        String userId = (String) request.getAttribute("userId");
        sectionService.updateVideoSectionById(userId, sectionId, updateVideoSectionVo);
        return R.success().message("Update video section success");
    }

    @Operation(summary = "Upload a video cover")
    @PostMapping("videoCover")
    public R uploadVideoCover(HttpServletRequest request, MultipartFile file) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Upload video cover success").data("videoCover",
                sectionService.uploadVideoCover(userId, file));
    }

    @Operation(summary = "Get one section info")
    @GetMapping("section/{sectionId}")
    public R getSection(HttpServletRequest request, @PathVariable String sectionId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get section information success").data("section",
                sectionService.getSectionById(userId, sectionId));
    }

    @Operation(summary = "Get all the text sections of a course")
    @GetMapping("textSections/{courseId}")
    public R getTextSections(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get text sections information success").data("sections",
                sectionService.getTextSectionListByCourseId(userId, courseId));
    }

    @Operation(summary = "Get all the video sections of a course")
    @GetMapping("videoSections/{courseId}")
    public R getVideoSections(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get video sections information success").data("sections",
                sectionService.getVideoSectionListByCourseId(userId, courseId));
    }

    @Operation(summary = "Get all the sections of a course")
    @GetMapping("sections/{courseId}")
    public R getSections(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get sections information success").data("sections",
                sectionService.getSectionListByCourseId(userId, courseId));
    }
}
