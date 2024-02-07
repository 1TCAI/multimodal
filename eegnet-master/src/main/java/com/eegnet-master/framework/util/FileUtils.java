package com.eegnet.framework.util;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

/**
 * @Description
 * @Author sun
 * @Date 2019/3/29 10:42
 * @Version 1.0
 */
public class FileUtils {

    public static File saveTmpFile(MultipartFile file) throws IOException {
        File targetFolder = new File(System.getProperty("java.io.tmpdir"), "pathUpload");
        if (!targetFolder.exists()) {
            targetFolder.mkdirs();
        }
        File picFile = new File(targetFolder.getPath() + "/" + System.currentTimeMillis()
                + "banner" + "."
                + FilenameUtils.getExtension(file.getOriginalFilename()));
        file.transferTo(picFile);
        return picFile;
    }
}
