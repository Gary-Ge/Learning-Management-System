package com.gogohd.stream.controller;

import com.gogohd.base.utils.R;
import com.gogohd.stream.entity.vo.CreateStreamVo;
import com.gogohd.stream.entity.vo.UpdateStreamVo;
import com.gogohd.stream.service.StreamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("stream-basic")
@Tag(name = "Stream related APIs")
public class StreamController {
    @Autowired
    private StreamService streamService;

    @PostMapping("stream/{courseId}")
    @Operation(summary = "Create a new stream lesson")
    public R createStream(HttpServletRequest request, @PathVariable String courseId,
                          @RequestBody CreateStreamVo createStreamVo) {
        String userId = (String) request.getAttribute("userId");
        streamService.createStream(userId, courseId, createStreamVo);
        return R.success().message("Create stream lesson success");
    }

    @PutMapping("stream/{streamId}")
    @Operation(summary = "Update a stream lesson")
    public R updateStream(HttpServletRequest request, @PathVariable String streamId,
                          @RequestBody UpdateStreamVo updateStreamVo) {
        String userId = (String) request.getAttribute("userId");
        streamService.updateStream(userId, streamId, updateStreamVo);
        return R.success().message("Update stream lesson success");
    }

    @DeleteMapping("stream/{streamId}")
    @Operation(summary = "Delete a stream lesson")
    public R deleteStream(HttpServletRequest request, @PathVariable String streamId) {
        String userId = (String) request.getAttribute("userId");
        streamService.deleteStream(userId, streamId);
        return R.success().message("Delete stream lesson success");
    }

    @GetMapping("stream/{streamId}")
    @Operation(summary = "Get one stream info")
    public R getStream(HttpServletRequest request, @PathVariable String streamId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get stream lesson info success").data("stream",
                streamService.getStreamById(userId, streamId));
    }

    @GetMapping("streams/{courseId}")
    @Operation(summary = "Get all the streams info of one course")
    public R getStreamList(HttpServletRequest request, @PathVariable String courseId) {
        String userId = (String) request.getAttribute("userId");
        return R.success().message("Get stream lesson info success").data("streams",
                streamService.getStreamListByCourseId(userId, courseId));
    }
}
