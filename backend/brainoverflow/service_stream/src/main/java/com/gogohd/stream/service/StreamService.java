package com.gogohd.stream.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gogohd.stream.entity.Stream;
import com.gogohd.stream.entity.vo.CreateStreamVo;
import com.gogohd.stream.entity.vo.UpdateStreamVo;

import java.util.List;
import java.util.Map;

public interface StreamService extends IService<Stream> {
    void createStream(String userId, String courseId, CreateStreamVo createStreamVo);

    void updateStream(String userId, String streamId, UpdateStreamVo updateStreamVo);

    void deleteStream(String userId, String streamId);

    Map<String, Object> getStreamById(String userId, String streamId);

    List<Map<String, Object>> getStreamListByCourseId(String userId, String courseId);

    void startStream(String userId, String streamId);

    void finishStream(String userId, String streamId);

    String playStream(String userId, String streamId);

    String getPushUrl(String userId, String streamId);
}
