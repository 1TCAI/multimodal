package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.SysMenu;
import com.eegnet.web.entity.SysRole;
import com.eegnet.web.entity.SysRoleMenu;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.request.SysRoleRequest;
import com.eegnet.web.request.SysRoleUserRequest;
import com.eegnet.web.response.*;
import com.eegnet.web.service.SysRoleService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/system/")
public class SysRoleController {

    @Autowired
    private SysRoleService sysRoleService;

    @RequestMapping("role")
    @RequiresPermissions("role:list")
    @SysLog(value = "查看-角色管理")
    public String index(){ return "system/role/index"; }

    @RequestMapping("role/update")
    @ResponseBody
    @RequiresPermissions("role:update")
    public ModelAndView update(@RequestParam(value = "roleId",required = false) Integer roleId) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("system/role/update");
        modelAndView.addObject("sysRole", sysRoleService.getRole(roleId));
        return modelAndView;
    }

    @RequestMapping("role/addPage")
    public String addPage() {
        return "system/role/new";
    }

    @ResponseBody
    @RequestMapping("role/list")
    public DataTablePagerResult<SysRole> list (SysRoleRequest request){
        DataTablePagerResult<SysRole> result = sysRoleService.listAllSysRole(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("role/add")
    @RequiresPermissions("role:create")
    @SysLog(value = "新建-角色", type = ActionType.ADD)
    public ResponseResult<Void> addRole(@RequestBody SysRole sysRole) {
        sysRoleService.addSysRole(sysRole);
        ResponseResult<Void> result = new ResponseResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("role/delete")
    @RequiresPermissions("role:delete")
    @SysLog(value = "删除-角色", type = ActionType.DELETE)
    public ResponseResult<Void> deleteRole(@RequestParam(value = "roleId",required = false) Integer roleId) {
        Boolean b = sysRoleService.deleteSysRole(roleId);
        ResponseResult<Void> result = new ResponseResult<>();
        if(b){
            result.setMsg(ResponseCode.OK.msg);
            result.setCode(ResponseCode.OK.code);
        }else{
            result.setMsg("当前角色下存在用户，不能删除");
            result.setCode(ResponseCode.ERROR.code);
        }
        return result;
    }

    @ResponseBody
    @RequestMapping("role/getAllMenu")
    public List<RoleMenuResponse> getAllMenu() {
        return sysRoleService.getAllMenu();
    }

    @ResponseBody
    @RequestMapping("role/getAllUser")
    public ResponseResult<List> getSysRoleUser() {
        ResponseResult<List> result = new ResponseResult<>();
        List<SysUser> data = sysRoleService.getAllSysRoleUser();
        result.setData(data);
        result.setData(data);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }


    @ResponseBody
    @RequestMapping("role/getMenu")
    public ResponseResult<SysMenu> getSysRoleMenu(@RequestParam(value = "roleId", required = false) Integer roleId) {
        ResponseResult<SysMenu> result = new ResponseResult<>();
        SysMenu sysMenu = sysRoleService.getSysRoleMenu(roleId);
        result.setData(sysMenu);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("role/getUser")
    public ResponseResult<SysUser> getSysRoleUser(@RequestParam(value = "roleId", required = false) Integer roleId) {
        ResponseResult<SysUser> result = new ResponseResult<>();
        SysUser sysUser = sysRoleService.getSysRoleUser(roleId);
        result.setData(sysUser);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("role/getMenuIdByRoleId")
    public ResponseResult<SysRole> getMenuIdByRoleId(@RequestParam(value = "roleId", required = false) Integer roleId) {
        ResponseResult<SysRole> result = new ResponseResult<>();
        SysRole sysRole = sysRoleService.getMenuIdByRoleId(roleId);
        result.setData(sysRole);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
    /**
     * @Description 查询角色用户信息
     * @Date  10:45
     * @Param
     * @return
     **/
    @ResponseBody
    @RequestMapping(value = "role/roleUserList")
    public DataTablePagerResult<SysUser> getRoleUserList (SysRoleUserRequest request){
        DataTablePagerResult<SysUser> result = sysRoleService.getRoleUserList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    /**
     * @Description 更新角色权限
     * @Date  18:11
     * @Param [roleId, idArray]
     * @return com.eegnet.web.response.ResponseResult<com.eegnet.web.entity.SysMenu>
     **/
    @ResponseBody
    @RequestMapping(value = "role/updateRoleMenu")
    @RequiresPermissions("role:update")
    @SysLog(value = "修改-角色", type = ActionType.UPDATE)
    public ResponseResult<SysRoleMenu> updateRoleMenu (SysRole sysRole,@RequestParam(value = "idArray[]",required = false) List<Integer> idArray){
        ResponseResult<SysRoleMenu> result = new ResponseResult<SysRoleMenu>();
        boolean b = sysRoleService.updateRoleMenu(sysRole,idArray);
        if(b){
            result.setMsg(ResponseCode.OK.msg);
            result.setCode(ResponseCode.OK.code);
        }else{
            result.setMsg(ResponseCode.ERROR.msg);
            result.setCode(ResponseCode.ERROR.code);
        }
        return result;
    }

    /**
     * @Description 更新角色权限
     * @Date  18:11
     * @Param [roleId, idArray]
     **/
    @ResponseBody
    @RequestMapping(value = "role/updateRole")
    @RequiresPermissions("role:update")
    @SysLog(value = "修改-角色", type = ActionType.UPDATE)
    public ResponseResult<SysRole> updateRole (SysRole sysRole){
        try {
            sysRoleService.updateRole(sysRole);
            return ResponseResult.e(ResponseCode.OK);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseResult.e(ResponseCode.ERROR);
        }
    }

    @ResponseBody
    @RequestMapping("role/getAllMenuAndRoleMenu")
    public Map<String,Object> getAllMenuAndRoleMenu(@RequestParam(value = "roleId",required = false) Integer roleId) {

        Map<String,Object> map = new HashMap<>();

        List<RoleMenuResponse> allMenu = sysRoleService.getAllMenu();
        List<SysRoleMenu> roleMenu = sysRoleService.findSysRoleMenu(roleId);
        map.put("allMenu",allMenu);
        map.put("roleMenu",roleMenu);
        map.put("code",1);
        map.put("msg","请求成功");
        return map;
    }
}