package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author sun
 * @date 2019/06/10
 */
@Data
@NoArgsConstructor
public class RtmsRequest {
    private Integer patientGender;
    private String diseaseType;
    private String diagnose;
    private Integer treatmentCount;
    private Integer dimensions;
    private String birthday;
    private String pretreatmentEvaluation;
    private String patientNumber;
    private String hospitalNumber;
    private Integer isDeleted;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
