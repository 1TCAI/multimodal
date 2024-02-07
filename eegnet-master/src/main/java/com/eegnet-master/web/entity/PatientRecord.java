package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PatientRecord {
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
	private String createDate;
	private String creater;
	private String updateDate;
	private String updater;
	private Integer isDeleted;
	private String birthday;
	private String hospitalNumber;
//	严重程度
	private Integer dimensions;
}
