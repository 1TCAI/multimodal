package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.SysRole;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.request.SysUserRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.response.ResponseResult;
import com.eegnet.web.service.SysRoleService;
import com.eegnet.web.service.SysUserService;
import java.util.List;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/system/")
public class SysUsersController {

    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private SysRoleService sysRoleService;

    @RequestMapping("user")
    @RequiresPermissions("user:list")
    @SysLog(value = "查看-用户管理")
    public String index() {
        return "system/user/index";
    }

    @RequestMapping("user/updatepassword")
    public String updatepassword() {
        return "system/user/updatepassword";
    }

    @RequestMapping("user/update")
    @RequiresPermissions("user:update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("system/user/update");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("user/list")
    public DataTablePagerResult<SysUser> list(SysUserRequest request) {
        DataTablePagerResult<SysUser> result = sysUserService.getSysUserList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("user/selectByUserId")
    public PageResult<SysUser> selectByUserId(@RequestParam(value = "userId", required = false) String userId) {
        PageResult<SysUser> result = new PageResult<>();
        SysUser sysUser = sysUserService.selectByUserId(userId);
        result.setData(sysUser);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("user/password")
    @RequiresPermissions("user:updatePassword")
    @SysLog(value = "修改-用户密码", type = ActionType.UPDATE)
    public ResponseResult<Void> updatePassword(@RequestBody SysUser sysUser) {
        sysUserService.updatePassword(sysUser);
        ResponseResult<Void> result = new ResponseResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("user/selectRoleName")
    public ResponseResult<List> selectRoleName() {
        ResponseResult<List> result = new ResponseResult<>();
        List<SysRole> data = sysRoleService.getRoleName();
        result.setData(data);
        return result;
    }

    @ResponseBody
    @RequestMapping("user/selectUserByUserId")
    public ResponseResult<SysUser> selectUserByUserId(@RequestParam(value = "userId", required = false) String userId) {
        ResponseResult<SysUser> result = new ResponseResult<>();

        SysUser sysUser = sysUserService.selectUserByUserId(userId);
        result.setData(sysUser);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);

        return result;
    }

    @ResponseBody
    @RequestMapping("user/edit")
    @RequiresPermissions("user:update")
    @SysLog(value = "修改-用户信息", type = ActionType.UPDATE)
    public ResponseResult<Void> updateUserByUserId(@RequestBody SysUser sysUser) {
        ResponseResult<Void> result = new ResponseResult<>();
        List<SysUser> list = sysUserService.selectByUsername(sysUser.getUsername());
        if( null  != list && list.size() > 1){
            result.setMsg("用户名已存在");
            result.setCode(ResponseCode.ERROR.code);
            return result;
        }
        sysUserService.updateUserByUserId(sysUser);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("user/add")
    @RequiresPermissions("user:create")
    @SysLog(value = "新建-用户", type = ActionType.ADD)
    public ResponseResult<Void> add(@RequestBody SysUser sysUser) {
        ResponseResult<Void> result = new ResponseResult<>();
        List<SysUser> list = sysUserService.selectByUsername(sysUser.getUsername());
        if( null  != list && list.size() > 0){
            result.setMsg("用户名已存在");
            result.setCode(ResponseCode.ERROR.code);
            return result;
        }
        sysUserService.addUser(sysUser);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("user/updateStatus")
    @RequiresPermissions("user:status")
    @SysLog(value = "修改-用户状态", type = ActionType.UPDATE)
    public ResponseResult<Void> updateStatusByUserId(@RequestBody SysUser sysUser) {
        sysUserService.updateStatusByUserId(sysUser);
        ResponseResult<Void> result = new ResponseResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

}