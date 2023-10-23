package com.gogohd.edu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.edu.entity.Section;
import com.gogohd.edu.entity.vo.CreateTextSectionVo;
import com.gogohd.edu.entity.vo.CreateVideoSectionVo;
import com.gogohd.edu.entity.vo.UpdateTextSectionVo;
import com.gogohd.edu.entity.vo.UpdateVideoSectionVo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface SectionService extends IService<Section> {
    String createTextSection(String userId, String courseId, CreateTextSectionVo createTextSectionVo);

    void updateTextSectionById(String userId, String sectionId, UpdateTextSectionVo updateTextSectionVo);

    void deleteSection(String userId, String sectionId);

    Map<String, Object> getSectionById(String userId, String sectionId);

    String createVideoSection(String userId, String courseId, CreateVideoSectionVo createVideoSectionVo);

    void updateVideoSectionById(String userId, String sectionId, UpdateVideoSectionVo updateVideoSectionVo);

    String uploadVideoCover(String userId, MultipartFile file);

    List<Map<String, Object>> getTextSectionListByCourseId(String userId, String courseId);

    List<Map<String, Object>> getVideoSectionListByCourseId(String userId, String courseId);

    List<Map<String, Object>> getSectionListByCourseId(String userId, String courseId);
}
