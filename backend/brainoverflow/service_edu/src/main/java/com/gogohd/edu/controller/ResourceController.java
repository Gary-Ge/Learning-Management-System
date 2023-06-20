package com.gogohd.edu.controller;

import com.gogohd.base.utils.R;
import com.gogohd.edu.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("edu-resource")
@Tag(name = "Resources related APIs")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @Operation(summary = "Upload multiple resources for a section")
    @PostMapping("/resources/{sectionId}")
    public R uploadResources(HttpServletRequest request, @PathVariable String sectionId, MultipartFile[] files) {
        String userId = (String) request.getAttribute("userId");
        resourceService.uploadResources(userId, sectionId, files);
        return R.success().message("Upload resources success");
    }

    @Operation(summary = "Upload video")
    @PostMapping("/video/{sectionId}")
    public R uploadVideo(HttpServletRequest request, @PathVariable String sectionId, MultipartFile file) {
        String userId = (String) request.getAttribute("userId");
        resourceService.uploadVideo(userId, sectionId, file);
        return R.success().message("Upload video success");
    }

    @Operation(summary = "Download file")
    @GetMapping("/resource/{resourceId}")
    public void downloadResource(HttpServletRequest request, HttpServletResponse response,
                              @PathVariable String resourceId) {
        String userId = (String) request.getAttribute("userId");
        resourceService.downloadResource(userId, response, resourceId);
    }

    @Operation(summary = "Play video")
    @GetMapping("/video/{resourceId}")
    public R playVideo(HttpServletRequest request, @PathVariable String resourceId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Play video success").data("auth", resourceService.playVideo(userId, resourceId));
    }
}
