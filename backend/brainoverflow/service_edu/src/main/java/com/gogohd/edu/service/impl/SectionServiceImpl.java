package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.ArgsValidator;
import com.gogohd.base.utils.OssUtils;
import com.gogohd.base.utils.RandomUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Resource;
import com.gogohd.edu.entity.Section;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.entity.vo.CreateTextSectionVo;
import com.gogohd.edu.entity.vo.CreateVideoSectionVo;
import com.gogohd.edu.entity.vo.UpdateTextSectionVo;
import com.gogohd.edu.entity.vo.UpdateVideoSectionVo;
import com.gogohd.edu.mapper.ResourceMapper;
import com.gogohd.edu.mapper.SectionMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.SectionService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SectionServiceImpl extends ServiceImpl<SectionMapper, Section> implements SectionService {

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private ResourceMapper resourceMapper;

    private final String NO_AUTHORITY_CREATE = "You have no authority to create section for this course";
    private final String NO_AUTHORITY_UPDATE = "You have no authority to update this section";
    private final String NO_AUTHORITY_DELETE = "You have no authority to delete this section";
    private final String NO_AUTHORITY_GET = "You have no authority to get this section's information";
    private final String EMPTY_TITLE = "Section title cannot be empty";
    private final String EMPTY_CONTENT = "Section content cannot be empty";
    private final String EMPTY_TYPE = "Type cannot be empty";
    private final String EMPTY_YOUTUBE_LINK = "YouTube link cannot be empty for a YouTube video section";
    private final String ILLEGAL_TYPE = "Type can only be 1 or 2. 1 for YouTube video, 2 for custom video";
    private final String ILLEGAL_YOUTUBE_LINK = "Invalid YouTube link";
    private final String SECTION_NOT_EXIST = "Section not exist";
    @Override
    public String createTextSection(String userId, String courseId, CreateTextSectionVo createTextSectionVo) {
        // Check if this user has the authority to create section for this course
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(staffWrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_CREATE);
        }

        String title = createTextSectionVo.getTitle();
        String description = createTextSectionVo.getDescription();
        if (ObjectUtils.isEmpty(title)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_TITLE);
        }
        if (ObjectUtils.isEmpty(description)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_CONTENT);
        }

        // Construct a new section
        Section section = new Section();
        BeanUtils.copyProperties(createTextSectionVo, section);
        section.setType(0);
        section.setCourseId(courseId);
        section.setCreatedBy(userId);
        section.setUpdatedBy(userId);

        if (!save(section)) {
            throw new BrainException(ResultCode.ERROR, "Create text lesson failed");
        }
        return section.getSectionId();
    }

    @Override
    public void updateTextSectionById(String userId, String sectionId, UpdateTextSectionVo updateTextSectionVo) {
        checkSectionValidity(userId, sectionId, NO_AUTHORITY_UPDATE);

        // Update the section
        Section section = new Section();
        BeanUtils.copyProperties(updateTextSectionVo, section);
        section.setSectionId(sectionId);
        section.setUpdatedBy(userId);
        if (baseMapper.updateById(section) != 1) {
            throw new BrainException(ResultCode.ERROR, "Update section failed");
        }
    }

    @Override
    @Transactional
    public void deleteSection(String userId, String sectionId) {
        checkSectionValidity(userId, sectionId, NO_AUTHORITY_DELETE);

        // Delete all the resources related to this section
        LambdaQueryWrapper<Resource> resourceWrapper = new LambdaQueryWrapper<>();
        resourceWrapper.eq(Resource::getSectionId, sectionId);
        resourceMapper.delete(resourceWrapper);

        // Delete this section
        if (baseMapper.deleteById(sectionId) != 1) {
            throw new BrainException(ResultCode.ERROR, "Delete section failed");
        }
    }

    @Override
    public Map<String, Object> getTextSectionById(String userId, String sectionId) {
        // Check if this section exists
        Section section = baseMapper.selectById(sectionId);
        if (section == null) {
            throw new BrainException(ResultCode.ERROR, SECTION_NOT_EXIST);
        }

        // Check if this user has authority to delete this section
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, section.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_GET);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("sectionId", section.getSectionId());
        result.put("title", section.getTitle());
        result.put("description", section.getDescription());
        result.put("createdAt", section.getCreatedAt());
        result.put("updatedAt", section.getUpdatedAt());

        // Get the resources of this section, if any
        LambdaQueryWrapper<Resource> resourceWrapper = new LambdaQueryWrapper<>();
        resourceWrapper.eq(Resource::getSectionId, sectionId);
        List<Map<String, String>> resources = resourceMapper.selectList(resourceWrapper).stream()
                .map(resource -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("resourceId", resource.getResourceId());
                    map.put("title", resource.getTitle());

                    return map;
                }).collect(Collectors.toList());

        result.put("resources", resources);

        return result;
    }

    private void checkSectionValidity(String userId, String sectionId, String noAuthority) {
        // Check if this section exists
        Section section = baseMapper.selectById(sectionId);
        if (section == null) {
            throw new BrainException(ResultCode.ERROR, SECTION_NOT_EXIST);
        }

        // Check if this user has authority to delete this section
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, section.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, noAuthority);
        }
    }

    @Override
    public String createVideoSection(String userId, String courseId, CreateVideoSectionVo createVideoSectionVo) {
        // Check if this user has the authority to create section for this course
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(staffWrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_CREATE);
        }

        String title = createVideoSectionVo.getTitle();
        String description = createVideoSectionVo.getDescription();
        Integer type = createVideoSectionVo.getType();
        if (ObjectUtils.isEmpty(title)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_TITLE);
        }
        if (ObjectUtils.isEmpty(description)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_CONTENT);
        }
        if (ObjectUtils.isEmpty(type)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_TYPE);
        }
        if (type != 1 && type != 2) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_TYPE);
        }

        // Create new section
        Section section = new Section();
        BeanUtils.copyProperties(createVideoSectionVo, section);

        if (type == 1) {
            // If this is a YouTube video section
            String youtubeLink = createVideoSectionVo.getYoutubeLink();
            if (ObjectUtils.isEmpty(youtubeLink)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_YOUTUBE_LINK);
            }
            if (!ArgsValidator.isValidYoutubeLink(youtubeLink)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_YOUTUBE_LINK);
            }
            section.setCover(null);
        } else {
            // If this is a custom video section
            if (ObjectUtils.isEmpty(createVideoSectionVo.getCover())) {
                // If there is no cover provided, use the default one
                section.setCover("https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/video-cover/default" +
                        "/default-video-cover.svg");
            }
        }
        section.setCourseId(courseId);
        section.setCreatedBy(userId);
        section.setUpdatedBy(userId);

        if (!save(section)) {
            throw new BrainException(ResultCode.ERROR, "Create video section failed");
        }
        return section.getSectionId();
    }

    @Override
    @Transactional
    public void updateVideoSectionById(String userId, String sectionId, UpdateVideoSectionVo updateVideoSectionVo) {
        checkSectionValidity(userId, sectionId, NO_AUTHORITY_UPDATE);

        Integer type = updateVideoSectionVo.getType();
        if (ObjectUtils.isEmpty(type)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_TYPE);
        }
        if (type != 1 && type != 2) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_TYPE);
        }

        Section section = new Section();
        BeanUtils.copyProperties(updateVideoSectionVo, section);

        Section originSection = baseMapper.selectById(sectionId);
        Integer originType = originSection.getType();
        if (originType == type) {
            // If there is no type change, update directly
            if (type == 1) {
                String youtubeLink = updateVideoSectionVo.getYoutubeLink();
                if (!ObjectUtils.isEmpty(youtubeLink) && !ArgsValidator.isValidYoutubeLink(youtubeLink)) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_YOUTUBE_LINK);
                }
            }
        } else {
            if (type == 2 && originType == 1) {
                // Change from YouTube video section to custom video section
                if (!ObjectUtils.isEmpty(updateVideoSectionVo.getCover())) {
                    section.setCover("https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/video-cover/default" +
                            "/default-video-cover.svg");
                }
            } else if (type == 1 && originType == 2) {
                // Change from custom video section to YouTube video section
                String youtubeLink = updateVideoSectionVo.getYoutubeLink();
                if (ObjectUtils.isEmpty(youtubeLink)) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, EMPTY_YOUTUBE_LINK);
                }
                if (!ArgsValidator.isValidYoutubeLink(youtubeLink)) {
                    throw new BrainException(ResultCode.ILLEGAL_ARGS, ILLEGAL_YOUTUBE_LINK);
                }
                // Delete the original custom videos (if any)
                LambdaQueryWrapper<Resource> wrapper = new LambdaQueryWrapper<>();
                wrapper.eq(Resource::getSectionId, sectionId);
                resourceMapper.delete(wrapper);
            }
        }
        section.setSectionId(sectionId);
        section.setUpdatedBy(userId);
        if (baseMapper.updateById(section) != 1) {
            throw new BrainException(ResultCode.ERROR, "Update video section failed");
        }
    }

    @Override
    public String uploadVideoCover(String userId, String courseId, MultipartFile file) {
        // Check if this user has the authority to upload video cover for this section
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(staffWrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to upload video cover for " +
                    "this section");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be null");
        }
        String filenameLower = filename.toLowerCase();
        if (filenameLower.endsWith(".bmp") || filenameLower.endsWith(".jpg") || filenameLower.endsWith(".jpeg") ||
                filenameLower.endsWith("png")) {
            // Generate a UUID for each cover and use the UUID as filename, pretending file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "video-cover/" + courseId + "/" + RandomUtils.generateUUID() + extension;
            // Upload the avatar
            OssUtils.uploadFile(file, objectName, filename, true);
            // Return the avatar URL
            return "https://brainoverflow/" + objectName;
        } else {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "Unsupported file format. The cover " +
                    "should be jpg, jpeg, bmp or png");
        }
    }
}
