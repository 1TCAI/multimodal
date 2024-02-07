package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author sun
 * @date 2019/06/10
 */
@Data
@NoArgsConstructor
public class ScaleRequest {
    private Integer patientGender;
    private String patientNumber;
    private String rowDate;
    private String diseaseType;
    private String diagnose;
    private String birthday;
    private Integer dimensions;
    private String scaleType;
    private Integer isDeleted;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
