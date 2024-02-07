package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Description
 * @Author sun
 * @Date 2019/4/23 16:56
 * @Version 1.0
 */
@Data
@NoArgsConstructor
public class BasicStatisticsRequest {

    private String startDate;
    private String endDate;
}
