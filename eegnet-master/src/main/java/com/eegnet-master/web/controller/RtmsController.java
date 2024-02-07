package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.PatientRecord;
import com.eegnet.web.entity.Rtms;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.excel.RtmsExcel;
import com.eegnet.web.request.DiseaseTypeRequest;
import com.eegnet.web.request.PatientRecordRequest;
import com.eegnet.web.request.RtmsRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.DiseaseTypeService;
import com.eegnet.web.service.PatientRecordService;
import com.eegnet.web.service.RtmsService;
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
public class RtmsController {

    @Autowired
    private RtmsService rTmsService;

    @Autowired
    private RtmsExcel rTmsExcel;

    @Autowired
    private PatientRecordService patientRecordService;

    @Autowired
    private DiseaseTypeService diseaseTypeService;

    @RequestMapping("rTms")
    @RequiresPermissions("rTms:list")
    @SysLog(value = "查看-rTms管理")
    public ModelAndView rTms() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("rtms/index");
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

    @RequestMapping(value = "rTms/update", method = RequestMethod.GET)
    @RequiresPermissions("rTms:update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("rtms/update");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("rTms/list")
    public DataTablePagerResult<Rtms> list(RtmsRequest request) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        if (sysUser.getRoleId() != 1) {
            request.setIsDeleted(0);
        }
        DataTablePagerResult<Rtms> result = rTmsService.getRtmsList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("rTms/add")
    @RequiresPermissions("rTms:create")
    @SysLog(value = "新建-rTms", type = ActionType.ADD)
    public PageResult<Void> add(@RequestBody Rtms rTms) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        rTms.setCreater(sysUser.getUsername());
        rTmsService.addRtms(rTms);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("rTms/edit")
    @RequiresPermissions("rTms:update")
    @SysLog(value = "修改-rTms信息", type = ActionType.UPDATE)
    public PageResult<Void> edit(@RequestBody Rtms rTms) {
        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
        rTms.setUpdater(sysUser.getUsername());
        rTmsService.updateRtms(rTms);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("rTms/delete")
    @RequiresPermissions("rTms:delete")
    @SysLog(value = "删除-rTms", type = ActionType.DELETE)
    public PageResult<Void> delete(@RequestParam(value = "id", required = false) Long id) {
        rTmsService.deleteRtms(id);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("rTms/selectById")
    public PageResult<Rtms> selectById(@RequestParam(value = "id", required = false) Long id) {
        PageResult<Rtms> result = new PageResult<>();
        Rtms rTms = rTmsService.selectById(id);
        result.setData(rTms);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("rTms/exportExcel")
    public ModelAndView exportExcel(RtmsRequest request) {
        Map<String, Object> reportContentMap = new HashMap<String, Object>();
        reportContentMap.put("data", rTmsService.getRtmsList(request).getData());
        return new ModelAndView(rTmsExcel, "reportContentMap", reportContentMap);
    }

    @ResponseBody
    @RequestMapping("rTms/updateStatus")
    @RequiresPermissions("rTms:update")
    @SysLog(value = "状态修改-rTms", type = ActionType.UPDATE)
    public PageResult<Void> updateStatus(@RequestParam(value = "id", required = false) Long id, @RequestParam(value = "status", required = false) Integer status) {
        rTmsService.updateStatus(id, status);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
}
