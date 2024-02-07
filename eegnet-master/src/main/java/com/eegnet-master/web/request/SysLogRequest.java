package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author jinyqoqun
 * @date 2019/2/14
 */
@Data
@NoArgsConstructor
public class SysLogRequest {
    private String userName;
    private String startDate;
    private String endDate;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
