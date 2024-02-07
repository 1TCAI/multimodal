package com.eegnet.web.response;

import com.eegnet.web.entity.SysMenu;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * @author baiyu on 19/1/23.
 * @export
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourceResult extends SysMenu {

	Integer id;
	Integer level;
	Boolean isLeaf;
	Boolean expanded;

}