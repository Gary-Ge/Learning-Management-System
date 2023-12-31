package com.gogohd.base.utils;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dm.model.v20151123.SingleSendMailRequest;
import com.aliyuncs.dm.model.v20151123.SingleSendMailResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.gogohd.base.exception.BrainException;

import java.util.List;

public class SendEmailUtils {

    private final static String ACCESS_KEY_ID = "LTAI5tFiwCYvHzVFu9Pw9zuz";
    private final static String ACCESS_KEY_SECRET = "oSMmvPxjVwCt5IOJzCdFlLC4HZpBQ1";

    public static void sendVerificationCode(String email, String code) {
        IClientProfile profile = DefaultProfile.getProfile("ap-southeast-1", ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        try {
            DefaultProfile.addEndpoint("dm.ap-southeast-1.aliyuncs.com", "ap-southeast-1", "Dm",  "dm.ap-southeast-1.aliyuncs.com");
        } catch (ClientException e) {
            throw new BrainException(ResultCode.ERROR, "Sending email failed");
        }
        IAcsClient client = new DefaultAcsClient(profile);
        SingleSendMailRequest request = new SingleSendMailRequest();
        try {
            request.setAccountName("no-reply@brainoverflow.keyl1meqaq.top");
            request.setFromAlias("User Center");
            request.setAddressType(1);
            request.setTagName("ResetPassword");
            request.setReplyToAddress(false);
            request.setToAddress(email);
            request.setSubject("Verification code for resetting your password");
            request.setTextBody("Your verification code is " + code + "\n\nVerification code will be expired in 60 " +
                    "seconds");
            request.setMethod(MethodType.POST);
            SingleSendMailResponse response = client.getAcsResponse(request);
        } catch (ClientException e) {
            throw new BrainException(ResultCode.ERROR, "Sending email failed");
        }
    }

    public static void sendCourseMaterialUpdate(List<String> receivers, String content) {
        if (receivers.size() == 0) return;

        IClientProfile profile = DefaultProfile.getProfile("ap-southeast-1", ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        try {
            DefaultProfile.addEndpoint("dm.ap-southeast-1.aliyuncs.com", "ap-southeast-1", "Dm",  "dm.ap-southeast-1.aliyuncs.com");
        } catch (ClientException e) {
            throw new BrainException(ResultCode.ERROR, "Sending email failed");
        }
        IAcsClient client = new DefaultAcsClient(profile);
        SingleSendMailRequest request = new SingleSendMailRequest();
        try {
            request.setAccountName("no-reply@brainoverflow.keyl1meqaq.top");
            request.setFromAlias("Edu Center");
            request.setAddressType(1);
            request.setTagName("CourseUpdate");
            request.setReplyToAddress(false);
            request.setToAddress(String.join(",", receivers));
            request.setSubject("Course Update");
            request.setTextBody(content);
            request.setMethod(MethodType.POST);
            SingleSendMailResponse response = client.getAcsResponse(request);
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }

    public static void sendForumPostUpdate(List<String> receivers, String content) {
        if (receivers.size() == 0) return;

        IClientProfile profile = DefaultProfile.getProfile("ap-southeast-1", ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        try {
            DefaultProfile.addEndpoint("dm.ap-southeast-1.aliyuncs.com", "ap-southeast-1", "Dm",  "dm.ap-southeast-1.aliyuncs.com");
        } catch (ClientException e) {
            throw new BrainException(ResultCode.ERROR, "Sending email failed");
        }
        IAcsClient client = new DefaultAcsClient(profile);
        SingleSendMailRequest request = new SingleSendMailRequest();
        try {
            request.setAccountName("no-reply@brainoverflow.keyl1meqaq.top");
            request.setFromAlias("Forum Center");
            request.setAddressType(1);
            request.setTagName("ForumUpdate");
            request.setReplyToAddress(false);
            request.setToAddress(String.join(",", receivers));
            request.setSubject("Forum Update");
            request.setTextBody(content);
            request.setMethod(MethodType.POST);
            SingleSendMailResponse response = client.getAcsResponse(request);
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}
