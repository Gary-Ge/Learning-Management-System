package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ResourceService extends IService<Resource> {
    void uploadResources(String userId, String sectionId, MultipartFile[] files);
}
