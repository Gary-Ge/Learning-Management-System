package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.R;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.client.OpenFeignClient;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.entity.vo.UpdateAssignmentVo;
import com.gogohd.edu.mapper.*;
import com.gogohd.edu.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import com.gogohd.base.utils.OssUtils;
import com.gogohd.base.utils.RandomUtils;

import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl extends ServiceImpl<AssignmentMapper, Assignment> implements AssignmentService {
    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private OpenFeignClient openFeignClient;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private AssFilesMapper assFilesMapper;

    private final String NO_AUTHORITY_GET = "You have no authority to get sections information";
    private final String NO_AUTHORITY_DELETE = "You have no authority to delete this section";
    private final String NO_AUTHORITY_DOWNLOAD = "You have no authority to download this section";

    @Override
    public String createAssignment(String userId, String courseId, CreateAssignmentVo createAssignmentVo) {
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.ERROR, "Course not exist");
        }

        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create the assignment");
        }

        if (ObjectUtils.isEmpty(createAssignmentVo.getTitle())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment title cannot be empty");
        }
        if (ObjectUtils.isEmpty(createAssignmentVo.getDescription())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment description cannot be empty");
        }
        if (ObjectUtils.isEmpty(createAssignmentVo.getStart())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment start time cannot be empty");
        }
        if (ObjectUtils.isEmpty(createAssignmentVo.getEnd())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment end time cannot be empty");
        }

        Assignment assignment = new Assignment();
        assignment.setTitle(createAssignmentVo.getTitle());
        assignment.setDescription(createAssignmentVo.getDescription());

        assignment.setStart(DateTimeUtils.stringToDateTime(createAssignmentVo.getStart()));
        assignment.setEnd(DateTimeUtils.stringToDateTime(createAssignmentVo.getEnd()));

        assignment.setCourseId(courseId);

        baseMapper.insert(assignment);

        return assignment.getAssignmentId();
    }

    @Override
    public Map<String, Object> getAssignmentById(String assignmentId, String token) {
        Assignment assignment = baseMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment does not exist");
        }

        // Construct the result
        Map<String, Object> result = new HashMap<>();
        result.put("assignmentId", assignment.getAssignmentId());
        result.put("title", assignment.getTitle());
        result.put("description", assignment.getDescription());
        result.put("start", DateTimeUtils.dateTimeToString(assignment.getStart()));
        result.put("end", DateTimeUtils.dateTimeToString(assignment.getEnd()));

        // Fetch the information of related course
        Course course = courseMapper.selectById(assignment.getCourseId());
        result.put("course", course.getTitle());

        return result;
    }

    private void isStaffOrStudent(String userId, String courseId) {
        // Check if this user is a staff or a student of this course
        // If this user is neither a staff nor a student of this course, this user cannot view the information
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, courseId);
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
            studentWrapper.eq(Student::getCourseId, courseId);
            studentWrapper.eq(Student::getUserId, userId);
            if (!studentMapper.exists(studentWrapper)) {
                throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_GET);
            }
        }
    }

    @Override
    public List<Map<String, Object>> getAssignmentListByCourseId(String userId, String courseId, String token) {
        // Check if this user has authority to get this assignment information
        isStaffOrStudent(userId, courseId);

        LambdaQueryWrapper<Assignment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Assignment::getCourseId, courseId);

        return baseMapper.selectList(wrapper).stream()
                .map(assignment -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("assignmentId", assignment.getAssignmentId());
                    result.put("title", assignment.getTitle());
                    result.put("description", assignment.getDescription());
                    result.put("start", DateTimeUtils.dateTimeToString(assignment.getStart()));
                    result.put("end", DateTimeUtils.dateTimeToString(assignment.getEnd()));

                    // Fetch the information of related course
                    Course course = courseMapper.selectById(assignment.getCourseId());
                    result.put("course", course.getTitle());

                    return result;
                }).collect(Collectors.toList());
    }

    private void checkAssignmentValidity(String userId, String assignmentId, String noAuthority) {
        // Check if this assignment exists
        Assignment assignment = baseMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment does not exist");
        }

        // Check if this user has authority to delete this assignment
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, assignment.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, noAuthority);
        }
    }

    @Override
    @Transactional
    public void deleteAssignment(String userId, String assignmentId) {
        checkAssignmentValidity(userId, assignmentId, NO_AUTHORITY_DELETE);

        // Delete this assignment
        if (baseMapper.deleteById(assignmentId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete assignment failed");
        }
    }

    @Override
    @Transactional
    public void updateAssignment(String userId, String assignmentId, UpdateAssignmentVo updateAssignmentVo) {
        checkAssignmentValidity(userId, assignmentId, NO_AUTHORITY_DELETE);
        Assignment assignment = baseMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.ERROR, "Assignment does not exist");
        }

        if (ObjectUtils.isEmpty(updateAssignmentVo.getTitle())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment title cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateAssignmentVo.getDescription())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment description cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateAssignmentVo.getStart())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment start time cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateAssignmentVo.getEnd())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment end time cannot be empty");
        }

        assignment.setTitle(updateAssignmentVo.getTitle());
        assignment.setDescription(updateAssignmentVo.getDescription());
        assignment.setStart(DateTimeUtils.stringToDateTime(updateAssignmentVo.getStart()));
        assignment.setEnd(DateTimeUtils.stringToDateTime(updateAssignmentVo.getEnd()));

        int result = baseMapper.updateById(assignment);
        if (result == 0) {
            throw new BrainException(ResultCode.ERROR, "Failed to update the assignment");
        }
    }

    @Override
    @Transactional
    public void uploadAssignment(String userId, String assignmentId, MultipartFile[] files) {
        if (files == null) {
            throw new BrainException(ResultCode.ERROR, "No files");
        }
        // Check if this assignment exists
        Assignment assignment = baseMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment not exist");
        }

        // Check if this user has authority to upload files for this assignment
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, assignment.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to upload file for this assignment");
        }

        // Upload files
        for (MultipartFile file: files) {
            String filename = file.getOriginalFilename();
            if (filename == null) {
                throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be null");
            }
            // Generate a UUID for each file and use the UUID as filename, preventing file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "assignment/" + assignmentId + "/" + RandomUtils.generateUUID() + extension;
            // Upload the file
            OssUtils.uploadFile(file, objectName, filename, false);

            // Insert assignment record
            AssFiles assFile = new AssFiles();
            assFile.setTitle(filename);
            assFile.setSource("oss://" + objectName);
            assFile.setAssignmentId(assignmentId);
            assFile.setType(0);
            try {
                if (assFilesMapper.insert(assFile) < 1) {
                    throw new BrainException(ResultCode.ERROR, "Insert record failed");
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new BrainException(ResultCode.ERROR, "Database operation failed");
            }
        }
    }

    @Override
    public void downloadAssignment(String userId, HttpServletResponse response, String assignmentId, String fileId) {
        // Check if this assignment exists
        Assignment assignment = baseMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment not exists");
        }

        // Check if this user has the authority to access this file
        checkAssignmentValidity(userId, assignment.getAssignmentId(), NO_AUTHORITY_DOWNLOAD);

        // Fetch the specified file
        AssFiles fileToDownload = assFilesMapper.selectById(fileId);
        if (fileToDownload == null || !fileToDownload.getAssignmentId().equals(assignmentId)) {
            throw new BrainException(ResultCode.NOT_FOUND, "No file found for this assignment");
        }

        // Download the file
        String source = fileToDownload.getSource();
        String downloadName = fileToDownload.getTitle();
        String objectName = source.substring(6);
        OssUtils.downloadFile(response, objectName, downloadName);
    }
}
