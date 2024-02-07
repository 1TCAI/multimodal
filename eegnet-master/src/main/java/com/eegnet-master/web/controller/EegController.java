package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.Eeg;
import com.eegnet.web.entity.PatientRecord;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.excel.EegExcel;
import com.eegnet.web.request.DiseaseTypeRequest;
import com.eegnet.web.request.EegRequest;
import com.eegnet.web.request.PatientRecordRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.DiseaseTypeService;
import com.eegnet.web.service.EegService;
import com.eegnet.web.service.PatientRecordService;
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
public class EegController {

    @Autowired
    private EegService eegService;

    @Autowired
    private EegExcel eegExcel;

    @Autowired
    private PatientRecordService patientRecordService;

    @Autowired
    private DiseaseTypeService diseaseTypeService;

    @RequestMapping("eeg")
    @RequiresPermissions("eeg:list")
    @SysLog(value = "查看-EEG管理")
    public ModelAndView eeg() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("eeg/index");
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

    @RequestMapping(value = "eeg/update", method = RequestMethod.GET)
    @RequiresPermissions("eeg:update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("eeg/update");
        PatientRecordRequest request = new PatientRecordRequest();
        request.setPage(0);
        request.setLimit(0);
        List<PatientRecord> patientList = patientRecordService.getPatientRecordList(request).getData();
        for (PatientRecord item : patientList) {
            if (item.getPatientNumber().isEmpty()) {
                item.setPatientNumber(item.getHospitalNumber() + "(住)");
            } else {
                item.setPatientNumber(item.getPatientNumber() + "(门)");
            }
        }
        modelAndView.addObject("patientList", patientList);
        return modelAndView;
    }

    @RequestMapping("eeg/report")
    @RequiresPermissions("eeg:list")
    @SysLog(value = "查看-EEG管理")
    public ModelAndView eegReport() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("report/report");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("eeg/list")
    public DataTablePagerResult<Eeg> list(EegRequest request) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() != 1) {
            request.setIsDeleted(0);
        }
        DataTablePagerResult<Eeg> result = eegService.getEegList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("eeg/add")
    @RequiresPermissions("eeg:create")
    @SysLog(value = "新建-EEG", type = ActionType.ADD)
    public PageResult<Void> add(@RequestBody Eeg eeg) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        eeg.setCreater(sysUser.getUsername());
        eegService.addEeg(eeg);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("eeg/edit")
    @RequiresPermissions("eeg:update")
    @SysLog(value = "修改-EEG信息", type = ActionType.UPDATE)
    public PageResult<Void> edit(@RequestBody Eeg eeg) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        eeg.setUpdater(sysUser.getUsername());
        eegService.updateEeg(eeg);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("eeg/delete")
    @RequiresPermissions("eeg:delete")
    @SysLog(value = "删除-EEG", type = ActionType.DELETE)
    public PageResult<Void> delete(@RequestParam(value = "id", required = false) Long id) {
        eegService.deleteEeg(id);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("eeg/selectById")
    public PageResult<Eeg> selectById(@RequestParam(value = "id", required = false) Long id) {
        PageResult<Eeg> result = new PageResult<>();
        Eeg eeg = eegService.selectById(id);
        result.setData(eeg);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("eeg/exportExcel")
    public ModelAndView exportExcel(EegRequest request) {
        Map<String, Object> reportContentMap = new HashMap<String, Object>();
        reportContentMap.put("data", eegService.getEegList(request).getData());
        return new ModelAndView(eegExcel, "reportContentMap", reportContentMap);
    }

    @ResponseBody
    @RequestMapping("eeg/updateStatus")
    @RequiresPermissions("eeg:update")
    @SysLog(value = "状态修改-EEG", type = ActionType.UPDATE)
    public PageResult<Void> updateStatus(@RequestParam(value = "id", required = false) Long id, @RequestParam(value = "status", required = false) Integer status) {
        eegService.updateStatus(id, status);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

}
