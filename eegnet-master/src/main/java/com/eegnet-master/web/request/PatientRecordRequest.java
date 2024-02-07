package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author sun
 * @date 2019/06/10
 */
@Data
@NoArgsConstructor
public class PatientRecordRequest {
    private Integer patientGender;
    private Integer diseaseType;
    private String diagnose;
    private String birthday;
    private Integer dimensions;
    private String patientNumber;
    private String hospitalNumber;
    private Integer isDeleted;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
