package com.gogohd.base.utils;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.live.model.v20161101.DescribeLiveStreamsOnlineListRequest;
import com.aliyuncs.live.model.v20161101.DescribeLiveStreamsOnlineListResponse;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.gogohd.base.exception.BrainException;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class StreamUtils {

    private static final String PUSH_KEY = "1HzGDc0D2iSJWruW";

    private static final String PULL_KEY = "1TYjmtO77GbKFX9t";

    private static final String PUSH_DOMAIN = "stream.keyl1meqaq.xyz";

    private static final String PULL_DOMAIN = "playstream.keyl1meqaq.xyz";

    private static final Long EXPIRE = 10800L;

    private static final String APP_NAME = "brainoverflow";

    private static final String ACCESS_KEY_ID = "LTAI5tNyPnAdRQjcck8sxpMB";

    private static final String ACCESS_KEY_SECRET = "RCWK4tDNKYNbvBu9UmY2EjYeoq68Ww";

    public static String md5(String param) {
        if (param == null || param.length() == 0) {
            return null;
        }
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            md5.update(param.getBytes());
            byte[] bytes = md5.digest();

            BigInteger bigInteger = new BigInteger(1, bytes);
            StringBuilder result = new StringBuilder(bigInteger.toString(16));
            while (result.length() < 32) {
                result.insert(0, "0");
            }
            return result.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new BrainException(ResultCode.ERROR, "Generate stream url authorization code failed");
        }
    }

    public static String generatePushUrl(String streamId) {
        long timestamp = System.currentTimeMillis() / 1000L + EXPIRE;
        String stringToMd5 = "/" + APP_NAME + "/" + streamId + "-" + timestamp + "-0-0-" + PUSH_KEY;
        String authKey = md5(stringToMd5);
        return "rtmp://" + PUSH_DOMAIN + "/" + APP_NAME + "/" + streamId + "?auth_key=" + timestamp + "-0-0-" + authKey;
    }

    public static String generatePullUrl(String streamId) {
        long timestamp = System.currentTimeMillis() / 1000L + EXPIRE;
        String stringToMd5 = "/" + APP_NAME + "/" + streamId + ".flv-" + timestamp + "-0-0-" + PULL_KEY;
        String authKey = md5(stringToMd5);
        return "http://" + PULL_DOMAIN + "/" + APP_NAME + "/" + streamId + ".flv" + "?auth_key=" + timestamp + "-0-0-" + authKey;
    }

    public static Boolean isPushing(String streamId) {
        IClientProfile profile = DefaultProfile.getProfile("ap-southeast-1", ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        DefaultAcsClient client = new DefaultAcsClient(profile);

        DescribeLiveStreamsOnlineListRequest request = new DescribeLiveStreamsOnlineListRequest();
        request.setDomainName(PUSH_DOMAIN);
        request.setAppName(APP_NAME);
        request.setStreamName(streamId);

        try {
            DescribeLiveStreamsOnlineListResponse response = client.getAcsResponse(request);
            return response.getTotalNum() == 1;
        } catch (Exception e) {
            e.printStackTrace();
            throw new BrainException(ResultCode.ERROR, "Get stream status failed");
        }
    }
}
