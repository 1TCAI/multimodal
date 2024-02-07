package com.eegnet.web.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysMenu implements Serializable {

	Integer menuId;
	String menuName;
	Integer parentId;
	String url;
	String menuType;
	String perms;
	String icon;
	String createDate;
	String updateDate;
	Integer subCount;
	Integer sequence;

	List<SysMenu> maxMenu;
	List<SysMenu> children;
	List<SysMenu> grandMenu;


}
