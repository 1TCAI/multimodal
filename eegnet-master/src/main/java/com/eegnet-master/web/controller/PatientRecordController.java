package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.PatientRecord;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.excel.PatientRecordExcel;
import com.eegnet.web.request.DiseaseTypeRequest;
import com.eegnet.web.request.PatientRecordRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.DiseaseTypeService;
import com.eegnet.web.service.PatientRecordService;
import java.util.HashMap;
import java.util.Map;
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
public class PatientRecordController {

    @Autowired
    private PatientRecordService patientRecordService;

    @Autowired
    private PatientRecordExcel patientRecordExcel;

    @Autowired
    private DiseaseTypeService diseaseTypeService;

    @RequestMapping("patientRecord")
    @RequiresPermissions("patientRecord:list")
    @SysLog(value = "查看-被试资料管理")
    public ModelAndView patientRecord() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("patientRecord/index");
        DiseaseTypeRequest request = new DiseaseTypeRequest();
        request.setPage(0);
        request.setLimit(0);
        modelAndView.addObject("diseaseTypeList", diseaseTypeService.getDiseaseTypeList(request).getData());
        request.setIsDeleted(0);
        modelAndView.addObject("diseaseTypeList_update", diseaseTypeService.getDiseaseTypeList(request).getData());
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() == 1) {
            modelAndView.addObject("isAdmin", 1);
        }
        return modelAndView;
    }

    @RequestMapping(value = "patientRecord/update", method = RequestMethod.GET)
    @RequiresPermissions("patientRecord:update")
    public ModelAndView update(@RequestParam(value = "id", required = false) Long id) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("patientRecord/update");
        DiseaseTypeRequest request = new DiseaseTypeRequest();
        request.setPage(0);
        request.setLimit(0);
        if (id == null) {
            request.setIsDeleted(0);
        }
        modelAndView.addObject("diseaseTypeList_update", diseaseTypeService.getDiseaseTypeList(request).getData());
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("patientRecord/list")
    public DataTablePagerResult<PatientRecord> list(PatientRecordRequest request) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() != 1) {
            request.setIsDeleted(0);
        }
        DataTablePagerResult<PatientRecord> result = patientRecordService.getPatientRecordList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("patientRecord/add")
    @RequiresPermissions("patientRecord:create")
    @SysLog(value = "新建-被试资料", type = ActionType.ADD)
    public PageResult<Void> add(@RequestBody PatientRecord patientRecord) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        patientRecord.setCreater(sysUser.getUsername());
        return patientRecordService.addPatientRecord(patientRecord);
    }

    @ResponseBody
    @RequestMapping("patientRecord/edit")
    @RequiresPermissions("patientRecord:update")
    @SysLog(value = "修改-被试资料信息", type = ActionType.UPDATE)
    public PageResult<Void> edit(@RequestBody PatientRecord patientRecord) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        patientRecord.setUpdater(sysUser.getUsername());
        return patientRecordService.updatePatientRecord(patientRecord);
    }

    @ResponseBody
    @RequestMapping("patientRecord/delete")
    @RequiresPermissions("patientRecord:delete")
    @SysLog(value = "删除-被试资料", type = ActionType.DELETE)
    public PageResult<Void> delete(@RequestParam(value = "id", required = false) Long id) {
        patientRecordService.deletePatientRecord(id);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("patientRecord/selectById")
    public PageResult<PatientRecord> selectById(@RequestParam(value = "id", required = false) Long id) {
        PageResult<PatientRecord> result = new PageResult<>();
        PatientRecord patientRecord = patientRecordService.selectById(id);
        result.setData(patientRecord);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("patientRecord/exportExcel")
    public ModelAndView exportExcel(PatientRecordRequest request) {
        Map<String, Object> reportContentMap = new HashMap<String, Object>();
        reportContentMap.put("data", patientRecordService.getPatientRecordList(request).getData());
        return new ModelAndView(patientRecordExcel, "reportContentMap", reportContentMap);
    }

    @ResponseBody
    @RequestMapping("patientRecord/updateStatus")
    @RequiresPermissions("patientRecord:update")
    @SysLog(value = "状态修改-被试资料", type = ActionType.UPDATE)
    public PageResult<Void> updateStatus(@RequestParam(value = "id", required = false) Long id, @RequestParam(value = "status", required = false) Integer status) {
        patientRecordService.updateStatus(id, status);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
}
