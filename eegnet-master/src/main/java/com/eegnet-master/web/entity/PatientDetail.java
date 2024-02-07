package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PatientDetail {
	private Integer id;
	private String patientNumber;
	private String patientName;
	private Integer patientGender;
	private Integer patientAge;
	private Integer education;
	private String phone;
	private String from;
	private String bedNumber;
	private String diseaseType;
	private String diagnose;
	private String outDiagnose;
	private String birthday;
	private String hospitalNumber;
	private Integer dimensions;
	private String eegRecord;
	private String eegDetail;
	private Integer eegType;
	private Integer haveSleep;
	private String applyDoctor;
	private String gatherDate;
	private Integer restingMotionThreshold;
	private String stimulusSite;
	private Integer stimulusIntensity;
	private Integer stimulusFrequency;
	private Integer stimulationTimeSeries;
	private Integer serialIntervalTime;
	private Integer totalTime;
	private Integer pulseCount;
	private String pretreatmentEvaluation;
	private Integer treatmentCount;
	private String treatmentDate;
	private String eegRecord_t;
	private String eegDetail_t;
	private Integer eegType_t;
	private Integer haveSleep_t;
	private String applyDoctor_t;
	private String gatherDate_t;
	private Integer isThreshold;
	private Integer threshold;
	private Integer stimulusIntensity_t;
}
