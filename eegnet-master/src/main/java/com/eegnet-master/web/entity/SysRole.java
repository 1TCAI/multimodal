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
public class SysRole implements Serializable {

	Integer roleId;
	String roleName;
	String remark;
	Integer status;
	String createDate;
	String updateDate;

	List<SysMenu> menuId;

	List<Integer> menuIds;

}
