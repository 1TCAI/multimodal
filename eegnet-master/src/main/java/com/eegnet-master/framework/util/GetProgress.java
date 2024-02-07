package com.eegnet.framework.util;

import java.io.File;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;

import com.aliyun.oss.OSSClient;

import com.aliyun.oss.OSSException;
import com.aliyun.oss.event.ProgressEvent;

import com.aliyun.oss.event.ProgressEventType;

import com.aliyun.oss.event.ProgressListener;

import com.aliyun.oss.model.PutObjectRequest;
import com.aliyun.oss.model.PutObjectResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @Description
 * @Author sun
 * @Date 2019/4/3 14:11
 * @Version 1.0
 */
public class GetProgress {


    /**
     * The uploading progress listener. Its progressChanged API is called by the SDK when there's an update.
     */

    static final String ENDPOINT = "http://oss-cn-beijing.aliyuncs.com";

    static String accessKeyId = "LTAIfS1vVNdjck0q";

    static String accessKeySecret = "cTesEzHYoYUD0fx1JVoT0T1Hnk109J";

    static String bucketName = "pandaguard-input";

    static class PutObjectProgressListener implements ProgressListener {

        private long bytesWritten = 0;

        private long totalBytes = -1;

        private boolean succeed = false;

        private HttpSession session;

        private int percent = 0;


        public PutObjectProgressListener() {

        }

        //构造方法中加入session
        public PutObjectProgressListener(HttpSession mSession) {
            this.session = mSession;
            session.setAttribute("msg", percent);
        }

        @Override

        public void progressChanged(ProgressEvent progressEvent) {

            long bytes = progressEvent.getBytes();

            ProgressEventType eventType = progressEvent.getEventType();

            switch (eventType) {

                case TRANSFER_STARTED_EVENT:

                    System.out.println("开始上传......");

                    session.setAttribute("msg", percent);

                    break;

                case REQUEST_CONTENT_LENGTH_EVENT:

                    this.totalBytes = bytes;

                    System.out.println(this.totalBytes + "视频将上传到阿里云OSS");

                    session.setAttribute("msg", percent);

                    break;

                case REQUEST_BYTE_TRANSFER_EVENT:

                    this.bytesWritten += bytes;

                    if (this.totalBytes != -1) {

                        percent = (int) (this.bytesWritten * 100.0 / this.totalBytes);

                        System.out.println(bytes + " 正在上传, 上传进度: " +

                                percent + "%(" + this.bytesWritten + "/" + this.totalBytes + ")");

                        session.setAttribute("msg", percent);

                    } else {

                        System.out.println(bytes + " 正在上传, 上传率: 未知" + "(" + this.bytesWritten + "/...)");

                        session.setAttribute("msg", percent);

                    }

                    break;

                case TRANSFER_COMPLETED_EVENT:

                    this.succeed = true;

                    System.out.println("上传成功, " + this.bytesWritten + " 字节已经上传完成");
                    session.setAttribute("msg", percent);

                    break;


                case TRANSFER_FAILED_EVENT:

                    System.out.println("上传失败, " + this.bytesWritten + " 字节已经传输");
                    session.setAttribute("msg", percent);

                    break;

                default:

                    break;

            }

        }

        public boolean isSucceed() {

            return succeed;

        }

    }


    /**
     * The downloading progress listener. Its progressChanged API is called by the SDK when there's an update.
     */

    static class GetObjectProgressListener implements ProgressListener {


        private long bytesRead = 0;

        private long totalBytes = -1;

        private boolean succeed = false;

        @Override

        public void progressChanged(ProgressEvent progressEvent) {

            long bytes = progressEvent.getBytes();

            ProgressEventType eventType = progressEvent.getEventType();

            switch (eventType) {

                case TRANSFER_STARTED_EVENT:

                    System.out.println("Start to download......");

                    break;

                case RESPONSE_CONTENT_LENGTH_EVENT:

                    this.totalBytes = bytes;

                    System.out.println(this.totalBytes + " bytes in total will be downloaded to a local file");

                    break;


                case RESPONSE_BYTE_TRANSFER_EVENT:

                    this.bytesRead += bytes;

                    if (this.totalBytes != -1) {

                        int percent = (int) (this.bytesRead * 100.0 / this.totalBytes);

                        System.out.println(bytes + " bytes have been read at this time, download progress: " +

                                percent + "%(" + this.bytesRead + "/" + this.totalBytes + ")");

                    } else {

                        System.out.println(bytes + " bytes have been read at this time, download ratio: unknown" +

                                "(" + this.bytesRead + "/...)");

                    }

                    break;

                case TRANSFER_COMPLETED_EVENT:

                    this.succeed = true;

                    System.out.println("Succeed to download, " + this.bytesRead + " bytes have been transferred in total");

                    break;


                case TRANSFER_FAILED_EVENT:

                    System.out.println("Failed to download, " + this.bytesRead + " bytes have been transferred");

                    break;

                default:

                    break;
            }
        }

        public boolean isSucceed() {
            return succeed;
        }
    }


    public static PutObjectResult upload(File file, String dir,String fileName, HttpServletRequest request)throws OSSException, ClientException {


        OSS client = new OSSClient(ENDPOINT, accessKeyId, accessKeySecret);
        PutObjectResult putObjectResult = new PutObjectResult();
        try {

            // 带进度条的上传
            putObjectResult=  client.putObject(new PutObjectRequest(bucketName, dir +"/"+fileName, file).

                    <PutObjectRequest>withProgressListener(new PutObjectProgressListener(request.getSession())));

        }catch (OSSException oe) {
            oe.printStackTrace();
        } catch (ClientException ce) {
            ce.printStackTrace();
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            client.shutdown();
        }

        return putObjectResult;
    }


}
