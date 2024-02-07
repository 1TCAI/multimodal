package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Eeg {
	private Integer id;
	private String patientNumber;
	private String hospitalNumber;
	private String patientName;
	private String diseaseType;
	private String diagnose;
	private String eegRecord;
	private String eegDetail;
	private Integer eegType;
	private Integer haveSleep;
	private String applyDoctor;
	private String gatherDate;
	private String createDate;
	private String creater;
	private String updateDate;
	private String updater;
	private Integer isDeleted;
	private Integer status;
}
