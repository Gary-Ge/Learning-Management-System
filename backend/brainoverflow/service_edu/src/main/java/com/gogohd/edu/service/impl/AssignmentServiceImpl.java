package com.gogohd.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.edu.entity.*;
import com.gogohd.edu.entity.vo.CreateAssignmentVo;
import com.gogohd.edu.entity.vo.MarkAssignmentVo;
import com.gogohd.edu.entity.vo.UpdateAssignmentVo;
import com.gogohd.edu.mapper.*;
import com.gogohd.edu.service.AssignmentService;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import com.gogohd.base.utils.OssUtils;
import com.gogohd.base.utils.RandomUtils;

import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl extends ServiceImpl<AssignmentMapper, Assignment> implements AssignmentService {
    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private AssFileMapper assFileMapper;

    @Autowired
    private SubmitMapper submitMapper;

    private final String NO_AUTHORITY_GET = "You have no authority to get sections information";
    private final String NO_AUTHORITY_DELETE = "You have no authority to delete this section";
    private final String NO_AUTHORITY_UPDATE = "You have no authority to update this assignment";
    private final String NO_AUTHORITY_DOWNLOAD = "You have no authority to download this section";

    @Override
    public String createAssignment(String userId, String courseId, CreateAssignmentVo createAssignmentVo) {
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BrainException(ResultCode.ERROR, "Course not exist");
        }

        // Check if this user is a staff of this course
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getUserId, userId);
        wrapper.eq(Staff::getCourseId, courseId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create the assignment");
        }

        // Check if a assignment with the same title already exists for the course
        LambdaQueryWrapper<Assignment> assignmentWrapper = new LambdaQueryWrapper<>();
        assignmentWrapper.eq(Assignment::getTitle, createAssignmentVo.getTitle());
        assignmentWrapper.eq(Assignment::getCourseId, courseId);
        if (baseMapper.selectCount(assignmentWrapper) > 0) {
            throw new BrainException(ResultCode.ERROR, "An assignment with the same title already exists for the course");
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
        if (ObjectUtils.isEmpty(createAssignmentVo.getMark())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment mark cannot be empty");
        }

        Assignment assignment = new Assignment();
        assignment.setTitle(createAssignmentVo.getTitle());
        assignment.setDescription(createAssignmentVo.getDescription());
        assignment.setMark(createAssignmentVo.getMark());
        try {
            LocalDateTime start = DateTimeUtils.stringToDateTime(createAssignmentVo.getStart());
            LocalDateTime end = DateTimeUtils.stringToDateTime(createAssignmentVo.getEnd());

            if (!start.isBefore(end)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The start time should be earlier than the end time");
            }
            if (!end.isAfter(LocalDateTime.now())) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The end time should be later than current time");
            }

            assignment.setStart(start);
            assignment.setEnd(end);
        } catch (DateTimeParseException e) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The format of date time should be 'yyyy-MM-dd HH:mm:ss'");
        }

        assignment.setCourseId(courseId);

        baseMapper.insert(assignment);
        return assignment.getAssignmentId();
    }

    @Override
    public Map<String, Object> getAssignmentById(String assignmentId, String userId) {
        Assignment assignment = baseMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment does not exist");
        }

        // Check if this user is a staff or a student of this course
        isStaffOrStudent(userId, assignment.getCourseId());

        // Construct the result
        Map<String, Object> result = new HashMap<>();
        result.put("assignmentId", assignment.getAssignmentId());
        result.put("title", assignment.getTitle());
        result.put("description", assignment.getDescription());
        result.put("start", assignment.getStart());
        result.put("end", assignment.getEnd());
        result.put("mark", assignment.getMark());

        // Fetch the information of ass files
        LambdaQueryWrapper<AssFile> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AssFile::getAssignmentId, assignmentId);
        List<Map<String, String>> list = assFileMapper.selectList(wrapper).stream()
                .map(assFile -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("assFileId", assFile.getFileId());
                    map.put("title", assFile.getTitle());

                    return map;
                }).collect(Collectors.toList());

        result.put("assFiles", list);

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
    public List<Map<String, Object>> getAssignmentListByCourseId(String userId, String courseId) {
        if (courseMapper.selectById(courseId) == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course does not exist");
        }
        // Check if this user has authority to get this assignment information
        isStaffOrStudent(userId, courseId);

        LambdaQueryWrapper<Assignment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Assignment::getCourseId, courseId);
        wrapper.orderByAsc(Assignment::getCreatedAt);

        return baseMapper.selectList(wrapper).stream()
                .map(assignment -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("assignmentId", assignment.getAssignmentId());
                    result.put("title", assignment.getTitle());
                    result.put("description", assignment.getDescription());
                    result.put("start", assignment.getStart());
                    result.put("end", assignment.getEnd());
                    result.put("mark", assignment.getMark());

                    // Get the ass files information, if any
                    LambdaQueryWrapper<AssFile> assFileWrapper = new LambdaQueryWrapper<>();
                    assFileWrapper.eq(AssFile::getAssignmentId, assignment.getAssignmentId());
                    List<Map<String, String>> list = assFileMapper.selectList(assFileWrapper).stream()
                            .map(assFile -> {
                                Map<String, String> map = new HashMap<>();

                                map.put("assFileId", assFile.getFileId());
                                map.put("title", assFile.getTitle());

                                return map;
                            }).collect(Collectors.toList());

                    result.put("assFiles", list);

                    return result;
                }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getAssignmentListDueByCourseId(String userId, String courseId) {
        if (courseMapper.selectById(courseId) == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Course does not exist");
        }

        isStaffOrStudent(userId, courseId);

        LocalDateTime currentTime = LocalDateTime.now();

        LambdaQueryWrapper<Assignment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Assignment::getCourseId, courseId);
        wrapper.gt(Assignment::getEnd, currentTime); // Filter assignments whose end time is before or equal to the current time
        wrapper.orderByAsc(Assignment::getEnd); // Sort by end time

        List<Assignment> assignments = baseMapper.selectList(wrapper);

        return assignments.stream()
                .map(assignment -> {
                    Map<String, Object> assignmentMap = new HashMap<>();
                    assignmentMap.put("title", assignment.getTitle());
                    assignmentMap.put("end", assignment.getEnd());
                    return assignmentMap;
                })
                .collect(Collectors.toList());
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

        // Delete all the ass files related to this assignment
        LambdaQueryWrapper<AssFile> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AssFile::getAssignmentId, assignmentId);
        assFileMapper.delete(wrapper);

        // Delete this assignment
        if (baseMapper.deleteById(assignmentId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete assignment failed");
        }
    }

    @Override
    @Transactional
    public void updateAssignment(String userId, String assignmentId, UpdateAssignmentVo updateAssignmentVo) {
        checkAssignmentValidity(userId, assignmentId, NO_AUTHORITY_UPDATE);

        if (ObjectUtils.isEmpty(updateAssignmentVo.getStart())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment start time cannot be empty");
        }
        if (ObjectUtils.isEmpty(updateAssignmentVo.getEnd())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "Assignment end time cannot be empty");
        }

        Assignment assignment = new Assignment();

        try {
            LocalDateTime start = DateTimeUtils.stringToDateTime(updateAssignmentVo.getStart());
            LocalDateTime end = DateTimeUtils.stringToDateTime(updateAssignmentVo.getEnd());

            if (!start.isBefore(end)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The start time should be earlier than the end time");
            }
            if (!end.isAfter(LocalDateTime.now())) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The end time should be later than current time");
            }

            assignment.setStart(start);
            assignment.setEnd(end);
        } catch (DateTimeParseException e) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The format of date time should be 'yyyy-MM-dd HH:mm:ss'");
        }

        assignment.setTitle(updateAssignmentVo.getTitle());
        assignment.setDescription(updateAssignmentVo.getDescription());
        assignment.setMark(updateAssignmentVo.getMark());
        assignment.setAssignmentId(assignmentId);

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
            if (filename.length() > 255) {
                throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "File name cannot be longer than 255 characters");
            }
            // Generate a UUID for each file and use the UUID as filename, preventing file overwriting
            String extension = filename.substring(filename.lastIndexOf("."));
            String objectName = "assignment/" + assignmentId + "/" + RandomUtils.generateUUID() + extension;
            // Upload the file
            OssUtils.uploadFile(file, objectName, filename, false);

            // Insert assignment record
            AssFile assFile = new AssFile();
            assFile.setTitle(filename);
            assFile.setSource("oss://" + objectName);
            assFile.setAssignmentId(assignmentId);
            try {
                if (assFileMapper.insert(assFile) < 1) {
                    throw new BrainException(ResultCode.ERROR, "Insert record failed");
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new BrainException(ResultCode.ERROR, "Database operation failed");
            }
        }
    }

    @Override
    public String downloadAssignment(String userId, String assFileId) {
        // Check if this ass file exists
        AssFile assFile = assFileMapper.selectById(assFileId);
        if (assFile == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment file not exist");
        }

        Assignment assignment = baseMapper.selectById(assFile.getAssignmentId());

        // Check if this user has the authority to download this file
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, assignment.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            LambdaQueryWrapper<Student> studentWrapper = new LambdaQueryWrapper<>();
            studentWrapper.eq(Student::getCourseId, assignment.getCourseId());
            studentWrapper.eq(Student::getUserId, userId);
            if (!studentMapper.exists(studentWrapper)) {
                throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_DOWNLOAD);
            }
        }

        // Generate download URL
        return OssUtils.downloadFile(assFile.getSource().substring(6));
    }

    @Override
    public void deleteAssignmentFile(String userId, String assFileId) {
        // Check if this ass file exists
        AssFile assFile = assFileMapper.selectById(assFileId);
        if (assFile == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "File not exist");
        }

        // Check if this user has the authority to delete this file
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, baseMapper.selectById(assFile.getAssignmentId()).getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to delete this file");
        }

        // Delete this file
        if (assFileMapper.deleteById(assFileId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete file failed");
        }
    }

    private void isStaff(String userId, String courseId) {
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, courseId);
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, NO_AUTHORITY_GET);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> getSubmitsByAssignmentId(String userId, String assignmentId) {
        Assignment assignment = baseMapper.selectById(assignmentId);
        if (assignment == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Assignment not exist");
        }

        isStaffOrStudent(userId, assignment.getCourseId());

        List<Map<String, Object>> maps = baseMapper.selectSubmitsByAssignmentId(assignmentId);
        List<Map<String, Object>> result = new ArrayList<>();

        String prevId = null;
        for (Map<String, Object> map: maps) {
            String currentId = (String) map.get("user_id");

            Map<String, Object> submit = new HashMap<>();
            submit.put("submitId", map.get("submit_id"));
            submit.put("name", map.get("name"));
            submit.put("createdAt", map.get("created_at"));

            // A new submit
            if (!Objects.equals(prevId, currentId)) {
                Map<String, Object> tmp = new HashMap<>();
                tmp.put("userId", currentId);
                tmp.put("username", map.get("username"));
                tmp.put("email", map.get("email"));
                tmp.put("avatar", map.get("avatar"));
                tmp.put("mark", map.get("mark") == null ? -1 : map.get("mark"));
                tmp.put("files", new LinkedList<>());
                result.add(tmp);

                prevId = currentId;
            }

            // Add this file to file list
            ((List<Map<String, Object>>) result.get(result.size() - 1).get("files")).add(submit);
        }

        Map<String, Object> finalResult = new HashMap<>();
        finalResult.put("assignmentId", assignment.getAssignmentId());
        finalResult.put("title", assignment.getTitle());
        finalResult.put("description", assignment.getDescription());
        finalResult.put("start", assignment.getStart());
        finalResult.put("end", assignment.getEnd());
        finalResult.put("createdAt", assignment.getCreatedAt());
        finalResult.put("updatedAt", assignment.getUpdatedAt());
        finalResult.put("mark", assignment.getMark());
        finalResult.put("submits", result);

        return finalResult;
    }

    @Override
    @Transactional
    public void markAssignmentByStaffId(String userId, String studentId, String assignmentId,
                                        MarkAssignmentVo markAssignmentVo) {
        // Check if the user is a staff member
        isStaff(userId, baseMapper.selectById(assignmentId).getCourseId());

        // Get the submission for the student and assignment
        LambdaQueryWrapper<Submit> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Submit::getSubmittedBy, studentId);
        wrapper.eq(Submit::getAssignmentId, assignmentId);
        List<Submit> submits = submitMapper.selectList(wrapper);

        if (submits.size() == 0) {
            throw new BrainException(ResultCode.NOT_FOUND, "Cannot find submission from this student");
        }

        if (ObjectUtils.isEmpty(markAssignmentVo.getMark())) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The mark cannot be empty");
        }

        Float mark = markAssignmentVo.getMark();
        Assignment assignment = baseMapper.selectById(submits.get(0).getAssignmentId());
        if (LocalDateTime.now().isBefore(assignment.getEnd())) {
            throw new BrainException(ResultCode.ERROR,
                    "You cannot mark the submits before the due date of the assignment");
        }
        if (mark < 0 || mark > assignment.getMark()) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS,
                    "Mark should be larger or equal to 0 and less or equal to the mark upper bound");
        }

        // Update mark
        Submit submit = new Submit();
        submit.setMark(mark);
        submitMapper.update(submit, wrapper);
    }

    @Override
    public String downloadSubmitBySubmitId(String userId, String submitId) {
        Submit submit = submitMapper.selectById(submitId);
        if (submit == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Submit not exist");
        }

        Assignment assignment = baseMapper.selectById(submit.getAssignmentId());
        LambdaQueryWrapper<Staff> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Staff::getCourseId, assignment.getCourseId());
        wrapper.eq(Staff::getUserId, userId);
        if (!staffMapper.exists(wrapper)) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to download this submit");
        }

        return OssUtils.downloadFile(submit.getSource().substring(6));
    }
}
