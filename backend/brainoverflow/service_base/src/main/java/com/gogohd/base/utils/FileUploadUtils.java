package com.gogohd.base.utils;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.internal.OSSHeaders;
import com.aliyun.oss.model.*;
import com.gogohd.base.exception.BrainException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public class FileUploadUtils {

    private static final String ACCESS_KEY_ID = "LTAI5tNyMm84sbENvLhPikRs";
    private static final String ACCESS_KEY_SECRET = "yhojBvza5DbUfcdKObl9xCDO3mMUVN";
    private static final String BUCKET_NAME = "brainoverflow";
    private static final String ENDPOINT = "https://oss-ap-southeast-2.aliyuncs.com";

    public static void uploadFile(MultipartFile file, String objectName, String downloadName, boolean publicRead) {
        OSS ossClient = new OSSClientBuilder().build(ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        try {
            InputStream inputStream = file.getInputStream();
            PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, objectName, inputStream);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setHeader(OSSHeaders.OSS_STORAGE_CLASS, StorageClass.Standard.toString());
            objectMetadata.setObjectAcl(publicRead ? CannedAccessControlList.PublicRead : CannedAccessControlList.Private);
            objectMetadata.setContentDisposition("attachment;filename=" + downloadName);
            putObjectRequest.setMetadata(objectMetadata);

            PutObjectResult result = ossClient.putObject(putObjectRequest);
        } catch (OSSException | ClientException | IOException e) {
            throw new BrainException(ResultCode.UPLOAD_FILE_ERROR, "Upload file failed");
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
}
