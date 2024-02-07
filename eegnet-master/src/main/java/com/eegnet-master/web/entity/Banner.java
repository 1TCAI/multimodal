package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Banner {
	private Integer id;
	private Integer type;
	private String title;
	private String description;
	private String imgUrl;
	private String clickUrl;
	private String sequence;
	private Integer width;
	private Integer height;
	private Integer verify;
}
