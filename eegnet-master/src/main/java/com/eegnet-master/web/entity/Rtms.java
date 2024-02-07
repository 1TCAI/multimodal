package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Rtms {
	private Integer id;
	private String patientNumber;
	private String hospitalNumber;
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
	private String createDate;
	private String creater;
	private String updateDate;
	private String updater;
	private Integer isDeleted;
	private String patientName;
	private String diseaseType;
	private String diagnose;
}
