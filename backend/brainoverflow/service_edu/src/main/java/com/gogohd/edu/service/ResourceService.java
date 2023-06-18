package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Resource;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;

public interface ResourceService extends IService<Resource> {
    void uploadResources(String userId, String sectionId, MultipartFile[] files);

    void uploadVideo(String userId, String sectionId, MultipartFile file);

    void downloadResource(String userId, HttpServletResponse response, String resourceId);
}
