package com.eegnet.web.dao;

import com.eegnet.web.entity.SysMenu;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
public interface SysMenuDao {

	List<SysMenu> listAllMenus();

	List<SysMenu> listParentMenus();

	List<SysMenu> listPageMenus();

	List<SysMenu> listSubMenus(@Param("parentId") Integer parentId);

	List<SysMenu> listSubButtons(@Param("parentId") Integer parentId);

	List<SysMenu> listParentMenusByRoleId(@Param("roleId") Integer roleId);

	List<SysMenu> listMenusByParentId(@Param("parentId") Integer parentId, @Param("roleId") Integer roleId);

	List<SysMenu> listButtonsByRoleId(@Param("roleId") Integer roleId);

	SysMenu selectResourceById(@Param("id") Integer id);

	void updateMenuById(SysMenu sysMenu);

	void addMenu(SysMenu sysMenu);
}
