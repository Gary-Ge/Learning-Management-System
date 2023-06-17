package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.FileUploadUtils;
import com.gogohd.base.utils.RandomUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Resource;
import com.gogohd.edu.entity.Section;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.mapper.ResourceMapper;
import com.gogohd.edu.mapper.SectionMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResourceServiceImpl extends ServiceImpl<ResourceMapper, Resource> implements ResourceService {

    @Autowired
    private SectionMapper sectionMapper;

    @Autowired
    private StaffMapper staffMapper;

    @Override
    @Transactional
    public void uploadResources(String userId, String sectionId, MultipartFile[] files) {
        // Check if this section exists
        Section section = sectionMapper.selectById(sectionId);
        if (section == null) {
            throw new BrainException(ResultCode.ERROR, "Section not exist");
        }

        // Check if this user has authority to upload files for this section
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, section.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to upload file for this section");
        }

        // Upload files
        for (MultipartFile file: files) {
            String filename = file.getOriginalFilename();
            if (filename == null) {
                throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be null");
            }
            // Generate a UUID for each cover and use the UUID as filename, pretending file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "resource/" + sectionId + "/" + RandomUtils.generateUUID() + extension;
            // Upload the avatar
            FileUploadUtils.uploadFile(file, objectName, filename, false);

            // Insert resource record
            Resource resource = new Resource();
            resource.setTitle(filename);
            resource.setSource("oss://" + objectName);
            resource.setType(0);
            resource.setSectionId(sectionId);
            resource.setCreatedBy(userId);
            if (!save(resource)) {
                throw new BrainException(ResultCode.ERROR, "Upload resources failed");
            }
        }
    }
}
