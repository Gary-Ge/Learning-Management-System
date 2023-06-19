package com.gogohd.edu.service.impl;

import com.aliyun.vod.upload.impl.UploadVideoImpl;
import com.aliyun.vod.upload.req.UploadStreamRequest;
import com.aliyun.vod.upload.resp.UploadStreamResponse;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.OssUtils;
import com.gogohd.base.utils.RandomUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.Resource;
import com.gogohd.edu.entity.Section;
import com.gogohd.edu.entity.Staff;
import com.gogohd.edu.entity.Student;
import com.gogohd.edu.mapper.ResourceMapper;
import com.gogohd.edu.mapper.SectionMapper;
import com.gogohd.edu.mapper.StaffMapper;
import com.gogohd.edu.mapper.StudentMapper;
import com.gogohd.edu.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;

@Service
public class ResourceServiceImpl extends ServiceImpl<ResourceMapper, Resource> implements ResourceService {

    @Autowired
    private SectionMapper sectionMapper;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private StudentMapper studentMapper;

    private final String ACCESS_KEY_ID = "LTAI5t5rn1iCNgUgUxbLMBzB";
    private final String ACCESS_KEY_SECRET = "2fbQ2PYOl5EDjBfFOnxvDB5wqMhvNB";

    @Override
    @Transactional
    public void uploadResources(String userId, String sectionId, MultipartFile[] files) {
        // Check if this section exists
        Section section = sectionMapper.selectById(sectionId);
        if (section == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Section not exist");
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
            OssUtils.uploadFile(file, objectName, filename, false);

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

    @Override
    public void uploadVideo(String userId, String sectionId, MultipartFile file) {
        // Check if this section exists
        Section section = sectionMapper.selectById(sectionId);
        if (section == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Section not exist");
        }

        // Check if this user has authority to upload files for this section
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, section.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to upload video for this section");
        }

        // Upload video
        String filename = file.getOriginalFilename();

        if (filename == null) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Filename cannot be empty");
        }

        try {
            InputStream inputStream = file.getInputStream();
            UploadStreamRequest request = new UploadStreamRequest(ACCESS_KEY_ID, ACCESS_KEY_SECRET,
                    filename, filename, inputStream);
            request.setApiRegionId("ap-southeast-1");
            UploadVideoImpl uploader = new UploadVideoImpl();
            UploadStreamResponse response = uploader.uploadStream(request);

            String videoId = response.getVideoId();

            // Save this resource to data table
            Resource resource = new Resource();
            resource.setTitle(filename);
            resource.setSource("vod://" + videoId);
            resource.setType(1);
            resource.setSectionId(sectionId);
            resource.setCreatedBy(userId);
            if (!save(resource)) {
                throw new BrainException(ResultCode.ERROR, "Upload video failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Upload video failed");
        }
    }

    @Override
    public void downloadResource(String userId, HttpServletResponse response, String resourceId) {
        // Check if this resource exists
        Resource resource = baseMapper.selectById(resourceId);
        if (resource == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Resource not exists");
        }

        // Get the section of this resource
        String courseId = sectionMapper.selectById(resource.getSectionId()).getCourseId();

        // Check if this user has the authority to download this file
        LambdaQueryWrapper<Staff> staffWrapper = new LambdaQueryWrapper<>();
        staffWrapper.eq(Staff::getUserId, userId);
        staffWrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(staffWrapper)) {
            // If this user is not a staff, check if this user is a student
            LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
            studentWrapper.eq(Student::getUserId, userId);
            studentWrapper.eq(Student::getCourseId, courseId);
            if (!studentMapper.exists(studentWrapper)) {
                // If this user is neither a staff nor a student, then refuse to download this file
                throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to download this file");
            }
        }

        // Download the file
        String source = resource.getSource();
        String downloadName = resource.getTitle();
        String objectName = source.substring(6);
        OssUtils.downloadFile(response, objectName, downloadName);
    }
}
