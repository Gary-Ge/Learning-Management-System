package com.gogohd.base.utils;

import com.aliyun.oss.*;
import com.aliyun.oss.internal.OSSHeaders;
import com.aliyun.oss.model.*;
import com.aliyuncs.profile.DefaultProfile;
import com.gogohd.base.exception.BrainException;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.Date;

public class OssUtils {

    private static final String ACCESS_KEY_ID = "LTAI5tNyMm84sbENvLhPikRs";
    private static final String ACCESS_KEY_SECRET = "yhojBvza5DbUfcdKObl9xCDO3mMUVN";
    private static final String BUCKET_NAME = "brainoverflow";
    private static final String ENDPOINT = "https://oss-ap-southeast-2.aliyuncs.com";

    private static final String MY_HOST = "oss.keyl1meqaq.xyz";

    public static void uploadFile(MultipartFile file, String objectName, String downloadName, boolean publicRead) {
        OSS ossClient = new OSSClientBuilder().build(ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        try {
            InputStream inputStream = file.getInputStream();
            PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, objectName, inputStream);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setHeader(OSSHeaders.OSS_STORAGE_CLASS, StorageClass.Standard.toString());
            objectMetadata.setObjectAcl(publicRead ? CannedAccessControlList.PublicRead : CannedAccessControlList.Private);

            String contentDisposition = publicRead ? "attachment;filename=" + downloadName : "inline;filename=" + downloadName;

            objectMetadata.setContentDisposition(contentDisposition);
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

    public static String downloadFile(String objectName) {
        // Generate signed url
        OSS ossClient = new OSSClientBuilder().build(MY_HOST, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        try {
            // Set Expiring date
            Date expiration = new Date(new Date().getTime() + 3600 * 1000L);
            // Generate URL
            URL url = ossClient.generatePresignedUrl(BUCKET_NAME, objectName, expiration);
            return url.toString().replace(BUCKET_NAME + ".", "");
        } catch (OSSException | ClientException oe) {
            oe.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Download file failed");
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
}
