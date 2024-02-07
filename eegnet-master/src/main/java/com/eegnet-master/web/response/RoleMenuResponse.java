package com.eegnet.web.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author baiyu on 19/3/13.
 * @export
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleMenuResponse {

	private String id;
	private String parent;
	private String icon;
	private String text;

}