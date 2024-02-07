package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DiseaseType {
	private Integer id;
	private String diseaseType;
	private String createDate;
	private String creater;
	private String updateDate;
	private String updater;
	private Integer isDeleted;
}
