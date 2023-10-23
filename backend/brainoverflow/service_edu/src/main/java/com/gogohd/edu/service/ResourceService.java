package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Resource;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public interface ResourceService extends IService<Resource> {
    void uploadResources(String userId, String sectionId, MultipartFile[] files);

    void uploadVideo(String userId, String sectionId, MultipartFile file);

    String downloadResource(String userId, String resourceId);

    Map<String, String> playVideo(String userId, String resourceId);

    void deleteResourceById(String userId, String resourceId);
}
