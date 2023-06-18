package com.gogohd.base.utils;

import com.aliyun.oss.*;
import com.aliyun.oss.internal.OSSHeaders;
import com.aliyun.oss.model.*;
import com.gogohd.base.exception.BrainException;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class OssUtils {

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

    public static void downloadFile(HttpServletResponse response, String objectName, String downloadName) {
        BufferedInputStream input = null;
        OutputStream outputStream = null;

        OSS ossClient = new OSSClientBuilder().build(ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        OSSObject ossObject = ossClient.getObject(BUCKET_NAME, objectName);

        try {
            response.reset();
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/octet-stream");
            response.addHeader("Content-Disposition",
                    "attachment;filename=" + downloadName);

            input = new BufferedInputStream(ossObject.getObjectContent());
            byte[] buffBytes = new byte[1024];
            outputStream = response.getOutputStream();
            int read = 0;
            while ((read = input.read(buffBytes)) != -1) {
                outputStream.write(buffBytes, 0, read);
            }
            outputStream.flush();

            ossObject.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Download file failed");
        } finally {
            try {
                if (outputStream != null) {
                    outputStream.close();
                }
                if (input != null) {
                    input.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            ossClient.shutdown();
        }
    }
}
