package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.ScaleType;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.request.ScaleTypeRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.ScaleTypeService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author sun
 * @date 2018/12/29
 */
@Controller
@RequestMapping("/eeg/")
public class ScaleTypeController {

    @Autowired
    private ScaleTypeService scaleTypeService;

    @RequestMapping("scaleType")
    @RequiresPermissions("scaleType:list")
    @SysLog(value = "查看-量表类型管理")
    public ModelAndView scaleType() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("scaleType/index");
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() == 1) {
            modelAndView.addObject("isAdmin", 1);
        }
        return modelAndView;
    }

    @RequestMapping(value = "scaleType/update", method = RequestMethod.GET)
    @RequiresPermissions("scaleType:update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("scaleType/update");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("scaleType/list")
    public DataTablePagerResult<ScaleType> list(ScaleTypeRequest request) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() != 1) {
            request.setIsDeleted(0);
        }
        DataTablePagerResult<ScaleType> result = scaleTypeService.getScaleTypeList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("scaleType/add")
    @RequiresPermissions("scaleType:create")
    @SysLog(value = "新建-量表类型", type = ActionType.ADD)
    public PageResult<Void> add(@RequestBody ScaleType scaleType) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        scaleType.setCreater(sysUser.getUsername());
        scaleTypeService.addScaleType(scaleType);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("scaleType/edit")
    @RequiresPermissions("scaleType:update")
    @SysLog(value = "修改-量表类型信息", type = ActionType.UPDATE)
    public PageResult<Void> edit(@RequestBody ScaleType scaleType) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        scaleType.setUpdater(sysUser.getUsername());
        scaleTypeService.updateScaleType(scaleType);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("scaleType/delete")
    @RequiresPermissions("scaleType:delete")
    @SysLog(value = "删除-量表类型", type = ActionType.DELETE)
    public PageResult<Void> delete(@RequestParam(value = "id", required = false) Long id) {
        scaleTypeService.deleteScaleType(id);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("scaleType/selectById")
    public PageResult<ScaleType> selectById(@RequestParam(value = "id", required = false) Long id) {
        PageResult<ScaleType> result = new PageResult<>();
        ScaleType scaleType = scaleTypeService.selectById(id);
        result.setData(scaleType);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("scaleType/updateStatus")
    @RequiresPermissions("scaleType:update")
    @SysLog(value = "状态修改-量表类型", type = ActionType.UPDATE)
    public PageResult<Void> updateStatus(@RequestParam(value = "id", required = false) Long id, @RequestParam(value = "status", required = false) Integer status) {
        scaleTypeService.updateStatus(id, status);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
}
