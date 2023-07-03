package com.gogohd.stream.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gogohd.base.exception.BrainException;
import com.gogohd.base.utils.DateTimeUtils;
import com.gogohd.base.utils.ResultCode;
import com.gogohd.stream.entity.Stream;
import com.gogohd.stream.entity.vo.CreateStreamVo;
import com.gogohd.stream.entity.vo.UpdateStreamVo;
import com.gogohd.stream.mapper.StreamMapper;
import com.gogohd.stream.service.StreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StreamServiceImpl extends ServiceImpl<StreamMapper, Stream> implements StreamService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public void createStream(String userId, String courseId, CreateStreamVo createStreamVo) {
        if (baseMapper.selectStaffCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to create stream lesson for this course");
        }

        // Check if the not null values are null
        String title = createStreamVo.getTitle();
        String description = createStreamVo.getDescription();
        String start = createStreamVo.getStart();
        String end = createStreamVo.getEnd();

        if (ObjectUtils.isEmpty(title)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The lesson title cannot be empty");
        }
        if (ObjectUtils.isEmpty(description)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The lesson description cannot be empty");
        }
        if (ObjectUtils.isEmpty(start)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The lesson start time cannot be empty");
        }
        if (ObjectUtils.isEmpty(end)) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The lesson end time cannot be empty");
        }

        Stream stream = new Stream();

        try {
            LocalDateTime startDate = DateTimeUtils.stringToDateTime(start);
            LocalDateTime endDate = DateTimeUtils.stringToDateTime(end);

            if (!startDate.isBefore(endDate)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The start time should be earlier than the end time");
            }
            if (!startDate.isAfter(LocalDateTime.now())) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The start time should be later than current time");
            }
            if (!endDate.isAfter(LocalDateTime.now())) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The end time should be later than current time");
            }

            stream.setStart(startDate);
            stream.setEnd(endDate);
        } catch (DateTimeParseException e) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The format of date time should be 'yyyy-MM-dd HH:mm:ss'");
        }

        stream.setTitle(title);
        stream.setDescription(description);
        stream.setCreatedBy(userId);
        stream.setUpdatedBy(userId);
        stream.setCourseId(courseId);

        // Insert record to database
        if (!save(stream)) {
            throw new BrainException(ResultCode.ERROR, "Create stream lesson failed");
        }
    }

    @Override
    public void updateStream(String userId, String streamId, UpdateStreamVo updateStreamVo) {
        Stream origin = baseMapper.selectById(streamId);
        if (origin == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Stream lesson not exist");
        }
        if (baseMapper.selectStaffCountById(userId, origin.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to update this stream lesson");
        }

        Stream stream = new Stream();

        String start = updateStreamVo.getStart();
        String end = updateStreamVo.getEnd();
        try {
            LocalDateTime startDate = DateTimeUtils.stringToDateTime(start);
            LocalDateTime endDate = DateTimeUtils.stringToDateTime(end);

            if (!startDate.isBefore(endDate)) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The start time should be earlier than the end time");
            }
            if (!startDate.isAfter(LocalDateTime.now())) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The start time should be later than current time");
            }
            if (!endDate.isAfter(LocalDateTime.now())) {
                throw new BrainException(ResultCode.ILLEGAL_ARGS, "The end time should be later than current time");
            }

            stream.setStart(startDate);
            stream.setEnd(endDate);
        } catch (DateTimeParseException e) {
            throw new BrainException(ResultCode.ILLEGAL_ARGS, "The format of date time should be 'yyyy-MM-dd HH:mm:ss'");
        }

        stream.setTitle(updateStreamVo.getTitle());
        stream.setDescription(updateStreamVo.getDescription());
        stream.setUpdatedBy(userId);
        stream.setStreamId(streamId);

        // Update this record
        if (baseMapper.updateById(stream) != 1) {
            throw new BrainException(ResultCode.ERROR, "Update stream lesson failed");
        }
    }

    @Override
    public void deleteStream(String userId, String streamId) {
        Stream stream = baseMapper.selectById(streamId);
        if (stream == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Stream lesson not exist");
        }
        if (baseMapper.selectStaffCountById(userId, stream.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to delete this stream lesson");
        }

        // Delete the stream lesson
        if (baseMapper.deleteById(streamId) < 1) {
            throw new BrainException(ResultCode.ERROR, "Delete stream lesson failed");
        }
    }

    @Override
    public Map<String, Object> getStreamById(String userId, String streamId) {
        Stream stream = baseMapper.selectById(streamId);
        if (stream == null) {
            throw new BrainException(ResultCode.NOT_FOUND, "Stream lesson not exist");
        }
        if (baseMapper.selectStaffCountById(userId, stream.getCourseId()) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to get this stream lesson info");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("streamId", stream.getStreamId());
        result.put("title", stream.getTitle());
        result.put("description", stream.getDescription());
        result.put("start", stream.getStart());
        result.put("end", stream.getEnd());
        result.put("createdAt", stream.getCreatedAt());
        result.put("updatedAt", stream.getUpdatedAt());
        result.put("inProgress", stringRedisTemplate.opsForValue().get("stream://" + streamId) != null);

        return result;
    }

    @Override
    public List<Map<String, Object>> getStreamListByCourseId(String userId, String courseId) {
        if (baseMapper.selectStaffCountById(userId, courseId) == 0) {
            throw new BrainException(ResultCode.NO_AUTHORITY, "You have no authority to get streams info of this course");
        }

        LambdaQueryWrapper<Stream> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Stream::getCourseId, courseId);
        return baseMapper.selectList(wrapper).stream()
                .map(stream -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("streamId", stream.getStreamId());
                    result.put("title", stream.getTitle());
                    result.put("description", stream.getDescription());
                    result.put("start", stream.getStart());
                    result.put("end", stream.getEnd());
                    result.put("createdAt", stream.getCreatedAt());
                    result.put("updatedAt", stream.getUpdatedAt());
                    result.put("inProgress", stringRedisTemplate.opsForValue().get("stream://" + stream.getStreamId()) != null);

                    return result;
                }).collect(Collectors.toList());
    }
}
