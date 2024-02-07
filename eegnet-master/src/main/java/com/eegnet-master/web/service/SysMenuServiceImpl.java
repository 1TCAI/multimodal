package com.eegnet.web.service.impl;

import com.eegnet.web.dao.SysMenuDao;
import com.eegnet.web.dao.SysUserDao;
import com.eegnet.web.entity.SysMenu;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.response.ResourceResult;
import com.eegnet.web.service.SysMenuService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
@Service
public class SysMenuServiceImpl implements SysMenuService {

	@Autowired
	private SysMenuDao sysMenuDao;
	@Autowired
	private SysUserDao sysUserDao;

	@Override
	public List<ResourceResult> listMenus() {
		List<ResourceResult> resultList = new ArrayList<>();
		ResourceResult result;
		List<SysMenu> menuList = sysMenuDao.listParentMenus();
		for (SysMenu menu : menuList) {
			resultList.add(result = new ResourceResult());
			result.setId(menu.getMenuId());
			BeanUtils.copyProperties(menu, result);
			result.setLevel(0);
			result.setIsLeaf(false);
			result.setExpanded(true);
			List<SysMenu> subMenuList = sysMenuDao.listSubMenus(menu.getMenuId());
			for (SysMenu subMenu : subMenuList) {
				resultList.add(result = new ResourceResult());
				result.setId(subMenu.getMenuId());
				BeanUtils.copyProperties(subMenu, result);
				result.setLevel(1);
				result.setExpanded(true);
				List<SysMenu> subButtonList = sysMenuDao.listSubButtons(subMenu.getMenuId());
				if (subButtonList.size() > 0) {
					result.setIsLeaf(false);
				} else {
					result.setIsLeaf(true);
				}
				for (SysMenu subButton : subButtonList) {
					resultList.add(result = new ResourceResult());
					result.setId(subButton.getMenuId());
					BeanUtils.copyProperties(subButton, result);
					result.setLevel(2);
					result.setIsLeaf(true);
				}
			}
		}
		return resultList;
	}

	@Override
	public List<SysMenu> listParentMenus() {
		return sysMenuDao.listParentMenus();
	}

	@Override
	public List<SysMenu> listPageMenus() {
		return sysMenuDao.listPageMenus();
	}

	@Override
	public SysMenu selectResourceById(Integer id) {
		return sysMenuDao.selectResourceById(id);
	}

	@Override
	public List<SysMenu> listMenusByUsername(String username) {
		SysUser user = sysUserDao.getByUsername(username);
		List<SysMenu> menuList = sysMenuDao.listParentMenusByRoleId(user.getRoleId());
		menuList.stream().forEach(
				menu -> {
					menu.setChildren(sysMenuDao.listMenusByParentId(menu.getMenuId(), user.getRoleId()));
				}
		);
		return menuList;
	}

  @Override
  public void updateMenuById(SysMenu sysMenu) {
    sysMenuDao.updateMenuById(sysMenu);
  }

  @Override
  public void addMenu(SysMenu sysMenu) {
    sysMenuDao.addMenu(sysMenu);
  }
}