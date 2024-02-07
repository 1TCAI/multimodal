package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StartUp {
	private Integer id;
	private String os;
	private String expireDate;
	private String imgUrl;
	private String clickUrl;
	private Integer verify;
}
