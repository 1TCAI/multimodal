package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.PatientRecord;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.entity.TmsEeg;
import com.eegnet.web.excel.TmsEegExcel;
import com.eegnet.web.request.DiseaseTypeRequest;
import com.eegnet.web.request.PatientRecordRequest;
import com.eegnet.web.request.TmsEegRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.DiseaseTypeService;
import com.eegnet.web.service.PatientRecordService;
import com.eegnet.web.service.TmsEegService;
import java.util.HashMap;
import java.util.List;
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
public class TmsEegController {

    @Autowired
    private TmsEegService tmsEegService;

    @Autowired
    private TmsEegExcel tmsEegExcel;

    @Autowired
    private PatientRecordService patientRecordService;

    @Autowired
    private DiseaseTypeService diseaseTypeService;

    @RequestMapping("tmsEeg")
    @RequiresPermissions("tmsEeg:list")
    @SysLog(value = "查看-TMS-EEG管理")
    public ModelAndView tmsEeg() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("tmsEeg/index");
        DiseaseTypeRequest request = new DiseaseTypeRequest();
        request.setPage(0);
        request.setLimit(0);
        modelAndView.addObject("diseaseTypeList", diseaseTypeService.getDiseaseTypeList(request).getData());
        PatientRecordRequest request0 = new PatientRecordRequest();
        request0.setPage(0);
        request0.setLimit(0);
        List<PatientRecord> patientList = patientRecordService.getPatientRecordList(request0).getData();
        for (PatientRecord item : patientList) {
            if (item.getPatientNumber().isEmpty()) {
                item.setPatientNumber(item.getHospitalNumber() + "(住)");
            } else {
                item.setPatientNumber(item.getPatientNumber() + "(门)");
            }
        }
        modelAndView.addObject("patientList", patientList);
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() == 1) {
            modelAndView.addObject("isAdmin", 1);
        }
        return modelAndView;
    }

    @RequestMapping(value = "tmsEeg/update", method = RequestMethod.GET)
    @RequiresPermissions("tmsEeg:update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("tmsEeg/update");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("tmsEeg/list")
    public DataTablePagerResult<TmsEeg> list(TmsEegRequest request) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() != 1) {
            request.setIsDeleted(0);
        }
        DataTablePagerResult<TmsEeg> result = tmsEegService.getTmsEegList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("tmsEeg/add")
    @RequiresPermissions("tmsEeg:create")
    @SysLog(value = "新建-TMS-EEG", type = ActionType.ADD)
    public PageResult<Void> add(@RequestBody TmsEeg tmsEeg) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        tmsEeg.setCreater(sysUser.getUsername());
        tmsEegService.addTmsEeg(tmsEeg);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("tmsEeg/edit")
    @RequiresPermissions("tmsEeg:update")
    @SysLog(value = "修改-TMS-EEG信息", type = ActionType.UPDATE)
    public PageResult<Void> edit(@RequestBody TmsEeg tmsEeg) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        tmsEeg.setUpdater(sysUser.getUsername());
        tmsEegService.updateTmsEeg(tmsEeg);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("tmsEeg/delete")
    @RequiresPermissions("tmsEeg:delete")
    @SysLog(value = "删除-TMS-EEG", type = ActionType.DELETE)
    public PageResult<Void> delete(@RequestParam(value = "id", required = false) Long id) {
        tmsEegService.deleteTmsEeg(id);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("tmsEeg/selectById")
    public PageResult<TmsEeg> selectById(@RequestParam(value = "id", required = false) Long id) {
        PageResult<TmsEeg> result = new PageResult<>();
        TmsEeg tmsEeg = tmsEegService.selectById(id);
        result.setData(tmsEeg);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("tmsEeg/exportExcel")
    public ModelAndView exportExcel(TmsEegRequest request) {
        Map<String, Object> reportContentMap = new HashMap<String, Object>();
        reportContentMap.put("data", tmsEegService.getTmsEegList(request).getData());
        return new ModelAndView(tmsEegExcel, "reportContentMap", reportContentMap);
    }

    @ResponseBody
    @RequestMapping("tmsEeg/updateStatus")
    @RequiresPermissions("tmsEeg:update")
    @SysLog(value = "状态修改-TMS-EEG", type = ActionType.UPDATE)
    public PageResult<Void> updateStatus(@RequestParam(value = "id", required = false) Long id, @RequestParam(value = "status", required = false) Integer status) {
        tmsEegService.updateStatus(id, status);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
}
