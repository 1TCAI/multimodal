package com.eegnet.framework.util;

import org.springframework.util.Assert;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * <Description> <br>
 *
 * @author wangqingyi <br>
 * @version 1.0 <br>
 * @Copyright: eegnet<br>
 * @project EEGManager <br>
 * @createDate 2019/10/21 10:19 <br>
 * @see com.eegnet.framework.util <br>
 */
public class DateUtils {
    /**
     * Format datetime string.
     *
     * @param timestamp the timestamp
     * @return the string
     */
    public static String formatDatetime(long timestamp) {

        Assert.notNull(timestamp, "timestamp is null");
        DateTimeFormatter ftf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return ftf.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault()));
    }
}
