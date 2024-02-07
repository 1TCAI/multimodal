package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.DiseaseType;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.request.DiseaseTypeRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.DiseaseTypeService;
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
public class DiseaseTypeController {

    @Autowired
    private DiseaseTypeService diseaseTypeService;

    @RequestMapping("diseaseType")
    @RequiresPermissions("diseaseType:list")
    @SysLog(value = "查看-疾病类型管理")
    public ModelAndView diseaseType() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("diseaseType/index");
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() == 1) {
            modelAndView.addObject("isAdmin", 1);
        }
        return modelAndView;
    }

    @RequestMapping(value = "diseaseType/update", method = RequestMethod.GET)
    @RequiresPermissions("diseaseType:update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("diseaseType/update");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("diseaseType/list")
    public DataTablePagerResult<DiseaseType> list(DiseaseTypeRequest request) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() != 1) {
            request.setIsDeleted(0);
        }
        DataTablePagerResult<DiseaseType> result = diseaseTypeService.getDiseaseTypeList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("diseaseType/add")
    @RequiresPermissions("diseaseType:create")
    @SysLog(value = "新建-疾病类型", type = ActionType.ADD)
    public PageResult<Void> add(@RequestBody DiseaseType diseaseType) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        diseaseType.setCreater(sysUser.getUsername());
        diseaseTypeService.addDiseaseType(diseaseType);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("diseaseType/edit")
    @RequiresPermissions("diseaseType:update")
    @SysLog(value = "修改-疾病类型信息", type = ActionType.UPDATE)
    public PageResult<Void> edit(@RequestBody DiseaseType diseaseType) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        diseaseType.setUpdater(sysUser.getUsername());
        diseaseTypeService.updateDiseaseType(diseaseType);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("diseaseType/delete")
    @RequiresPermissions("diseaseType:delete")
    @SysLog(value = "删除-疾病类型", type = ActionType.DELETE)
    public PageResult<Void> delete(@RequestParam(value = "id", required = false) Long id) {
        diseaseTypeService.deleteDiseaseType(id);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("diseaseType/selectById")
    public PageResult<DiseaseType> selectById(@RequestParam(value = "id", required = false) Long id) {
        PageResult<DiseaseType> result = new PageResult<>();
        DiseaseType diseaseType = diseaseTypeService.selectById(id);
        result.setData(diseaseType);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("diseaseType/updateStatus")
    @RequiresPermissions("diseaseType:update")
    @SysLog(value = "状态修改-疾病类型", type = ActionType.UPDATE)
    public PageResult<Void> updateStatus(@RequestParam(value = "id", required = false) Long id, @RequestParam(value = "status", required = false) Integer status) {
        diseaseTypeService.updateStatus(id, status);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
}
