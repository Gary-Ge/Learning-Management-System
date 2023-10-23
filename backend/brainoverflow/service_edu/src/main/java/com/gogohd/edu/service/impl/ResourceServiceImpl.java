package com.gogohd.edu.service.impl;

import com.aliyun.vod.upload.impl.UploadVideoImpl;
import com.aliyun.vod.upload.req.UploadStreamRequest;
import com.aliyun.vod.upload.resp.UploadStreamResponse;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.vod.model.v20170321.GetPlayInfoRequest;
import com.aliyuncs.vod.model.v20170321.GetPlayInfoResponse;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ResourceServiceImpl extends ServiceImpl<ResourceMapper, Resource> implements ResourceService {

    @Autowired
    private SectionMapper sectionMapper;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private StudentMapper studentMapper;

    private final String VOD_ACCESS_KEY_ID = "LTAI5tPZyXsoayWRe6FPKFQQ";
    private final String VOD_ACCESS_KEY_SECRET = "iGrS87JBIEOXPYRpQ7UnpUIbR7Os9i";
    private final String VOD_REGION_ID = "ap-southeast-1";

    @Override
    @Transactional
    public void uploadResources(String userId, String sectionId, MultipartFile[] files) {
        if (files == null) {
            throw new BrainException(ResultCode.ERROR, "No files");
        }
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
            if (filename.length() > 255) {
                throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be longer than 255 characters");
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
    @Transactional
    public void uploadVideo(String userId, String sectionId, MultipartFile file) {
        if (file == null) {
            throw new BrainException(ResultCode.ERROR, "No file");
        }

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
        if (filename.length() > 255) {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be longer than 255 characters");
        }
        if (!filename.toLowerCase().endsWith(".mp4")) {
            throw new BrainException(ResultCode.ERROR, "Only mp4 videos are supported now");
        }

        try {
            InputStream inputStream = file.getInputStream();
            UploadStreamRequest request = new UploadStreamRequest(VOD_ACCESS_KEY_ID, VOD_ACCESS_KEY_SECRET,
                    filename, filename, inputStream);
            request.setApiRegionId(VOD_REGION_ID);
            UploadVideoImpl uploader = new UploadVideoImpl();
            UploadStreamResponse response = uploader.uploadStream(request);

            String videoId = response.getVideoId();

            // Delete the previous video, if any
            LambdaQueryWrapper<Resource> resourceWrapper = new LambdaQueryWrapper<>();
            resourceWrapper.eq(Resource::getSectionId, sectionId);
            baseMapper.delete(resourceWrapper);

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

    private void isStaffOrStudent(String userId, String sectionId, String noAuthority) {
        // Get the section of this resource
        String courseId = sectionMapper.selectById(sectionId).getCourseId();

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
                throw new BrainException(ResultCode.NO_AUTHORITY, noAuthority);
            }
        }
    }

    @Override
    public String downloadResource(String userId, String resourceId) {
        // Check if this resource exists
        Resource resource = baseMapper.selectById(resourceId);
        if (resource == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Resource not exists");
        }

        // Check if this user has the authority to access this file
        isStaffOrStudent(userId, resource.getSectionId(), "You have no authority to download this file");

        // Download the file
        return OssUtils.downloadFile(resource.getSource().substring(6));
    }

    @Override
    public Map<String, String> playVideo(String userId, String resourceId) {
        // Check if this resource exists
        Resource resource = baseMapper.selectById(resourceId);
        if (resource == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Resource not exists");
        }
        // Check if this resource is a video
        if (resource.getType() != 1) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "This resource is not a video");
        }

        // Check if this user has the authority to play this video
        isStaffOrStudent(userId, resource.getSectionId(), "You have no authority to play this video");

        // Init the vod client
        DefaultProfile profile = DefaultProfile.getProfile(VOD_REGION_ID, VOD_ACCESS_KEY_ID, VOD_ACCESS_KEY_SECRET);
        DefaultAcsClient client = new DefaultAcsClient(profile);

        // Get video URL
        String videoId = resource.getSource().substring(6);
        GetPlayInfoRequest request = new GetPlayInfoRequest();
        request.setVideoId(videoId);
        request.setAuthTimeout(7200L);
        try {
            GetPlayInfoResponse response = client.getAcsResponse(request);
            List<GetPlayInfoResponse.PlayInfo> playInfoList = response.getPlayInfoList();

            Map<String, String> result = new HashMap<>();
            for (GetPlayInfoResponse.PlayInfo playInfo : playInfoList) {
                if (Objects.equals(playInfo.getSpecification(), "Original")) {
                    result.put("playURL", playInfo.getPlayURL());
                }
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Play video failed");
        }
    }

    @Override
    public void deleteResourceById(String userId, String resourceId) {
        // Check if this resource exists
        Resource resource = baseMapper.selectById(resourceId);
        if (resource == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Resource not exists");
        }

        // Check if this user has authority to delete files for this section
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, sectionMapper.selectById(resource.getSectionId()).getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to delete this resource");
        }

        // Delete the file
        if (baseMapper.deleteById(resourceId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete resource failed");
        }
    }
}
