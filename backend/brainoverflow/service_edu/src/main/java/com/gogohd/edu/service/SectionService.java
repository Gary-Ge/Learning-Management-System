package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Section;
import com.gogohd.edu.entity.vo.CreateTextSectionVo;
import com.gogohd.edu.entity.vo.CreateVideoSectionVo;
import com.gogohd.edu.entity.vo.UpdateTextSectionVo;
import com.gogohd.edu.entity.vo.UpdateVideoSectionVo;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface SectionService extends IService<Section> {
    String createTextSection(String userId, String courseId, CreateTextSectionVo createTextSectionVo);

    void updateTextSectionById(String userId, String sectionId, UpdateTextSectionVo updateTextSectionVo);

    void deleteSection(String userId, String sectionId);

    Map<String, Object> getTextSectionById(String userId, String sectionId);

    String createVideoSection(String userId, String courseId, CreateVideoSectionVo createVideoSectionVo);

    void updateVideoSectionById(String userId, String sectionId, UpdateVideoSectionVo updateVideoSectionVo);

    String uploadVideoCover(String userId, String courseId, MultipartFile file);
}
