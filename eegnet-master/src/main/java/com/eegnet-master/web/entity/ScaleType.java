package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ScaleType {
	private Integer id;
	private String scaleType;
	private Integer topicCount;
	private String separationCharacter;
	private String formula;
	private String judgementStandard;
	private String remark;
	private String createDate;
	private String creater;
	private String updateDate;
	private String updater;
	private Integer isDeleted;
	private String excelTitle;
}
