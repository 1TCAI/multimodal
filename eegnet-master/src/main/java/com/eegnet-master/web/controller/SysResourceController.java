package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.SysMenu;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResourceResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.response.ResponseResult;
import com.eegnet.web.service.SysMenuService;
import java.util.List;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author baiyu on 19/1/14.
 * @export
 */
@Controller
@RequestMapping("/system/resource")
public class SysResourceController {

	@Autowired
	private SysMenuService sysMenuService;

	@RequestMapping("")
	public String index(){ return "system/resource/index"; }

	@ResponseBody
	@RequestMapping("parentList")
	//@RequiresPermissions("resource:list")
	public List<ResourceResult> list(){
		return sysMenuService.listMenus();
	}

	@RequestMapping("update")
	@RequiresPermissions("resource:update")
	public ModelAndView update() {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("system/resource/update");
		modelAndView.addObject("parentsList", sysMenuService.listParentMenus());
		modelAndView.addObject("pagesList", sysMenuService.listPageMenus());
		return modelAndView;
	}

	@ResponseBody
	@RequestMapping("selectResourceById")
	public PageResult<SysMenu> selectResourceById(@RequestParam(value = "id", required = false) Integer id) {
		PageResult<SysMenu> result = new PageResult<>();
		SysMenu sysMenu = sysMenuService.selectResourceById(id);
		result.setData(sysMenu);
		result.setMsg(ResponseCode.OK.msg);
		result.setCode(ResponseCode.OK.code);
		return result;
	}

	@ResponseBody
	@RequestMapping("edit")
	@RequiresPermissions("resource:update")
	@SysLog(value = "修改-资源", type = ActionType.UPDATE)
	public ResponseResult<Void> updateUserByUserId(@RequestBody SysMenu sysMenu) {
		ResponseResult<Void> result = new ResponseResult<>();
		sysMenuService.updateMenuById(sysMenu);
		result.setMsg(ResponseCode.OK.msg);
		result.setCode(ResponseCode.OK.code);
		return result;
	}

	@ResponseBody
	@RequestMapping("add")
	@RequiresPermissions("resource:create")
	@SysLog(value = "新建-资源", type = ActionType.ADD)
	public ResponseResult<Void> add(@RequestBody SysMenu sysMenu) {
		ResponseResult<Void> result = new ResponseResult<>();
		sysMenuService.addMenu(sysMenu);
		result.setMsg(ResponseCode.OK.msg);
		result.setCode(ResponseCode.OK.code);
		return result;
	}
}