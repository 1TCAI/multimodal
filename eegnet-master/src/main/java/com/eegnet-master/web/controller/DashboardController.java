package com.eegnet.web.controller;

import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.service.EegService;
import com.eegnet.web.service.PatientRecordService;
import com.eegnet.web.service.RtmsService;
import com.eegnet.web.service.ScaleService;
import com.eegnet.web.service.TmsEegService;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author sun
 * @date 2018/12/29
 */
@Controller
@RequestMapping("/eeg/")
public class DashboardController {

    @Autowired
    private EegService eegService;

    @Autowired
    private PatientRecordService patientRecordService;

    @Autowired
    private RtmsService rTmsService;

    @Autowired
    private TmsEegService tmsEegService;

    @Autowired
    private ScaleService scaleService;

    @RequestMapping("dashboard")
    @RequiresPermissions("dashboard:list")
    @SysLog(value = "查看-dashboard")
    public ModelAndView dashboard() {
        ModelAndView mav = new ModelAndView("login");
        Subject currentUser = SecurityUtils.getSubject();
        if (currentUser.isAuthenticated() == false) {
            return mav;
        }
        mav.setViewName("dashboard/index");
        return mav;
    }

    @RequestMapping("dashboard/list")
    @RequiresPermissions("dashboard:list")
    @SysLog(value = "查看-dashboard全局查询")
    public String list() {
        return "dashboard/list";
    }

    @RequestMapping("dashboard/peopleDetailed")
    @RequiresPermissions("dashboard:list")
    @SysLog(value = "查看-dashboard个人资料")
    public String peopleDetailed() {
        return "dashboard/peopleDetailed";
    }

    @ResponseBody
    @RequestMapping("getAll")
    public Map<String, Integer> getAllMenu(@RequestParam(value = "keyset", required = false) String keyset) {
        Map<String, Integer> result = new HashMap<>();
        result.put("patientRecord", patientRecordService.getAllCount(keyset));
        result.put("eeg", eegService.getAllCount(keyset));
        result.put("tmsEeg", tmsEegService.getAllCount(keyset));
        result.put("rTms", rTmsService.getAllCount(keyset));
        result.put("scale", scaleService.getAllCount(keyset));
        return result;
    }

    @ResponseBody
    @RequestMapping("getPatientRecordData")
    public List<Map<String, Object>> getPatientRecordData(@RequestParam(value = "keyset", required = false) String keyset,
        @RequestParam(value = "startDate", required = false) String startDate,
        @RequestParam(value = "endDate", required = false) String endDate) {
        return patientRecordService.getChartData(keyset, startDate, endDate);
    }

    @ResponseBody
    @RequestMapping("getEegData")
    public Map<String, Object> getEegData(@RequestParam(value = "keyset", required = false) String keyset,
        @RequestParam(value = "startDate", required = false) String startDate,
        @RequestParam(value = "endDate", required = false) String endDate) {
        return eegService.getChartData(keyset, startDate, endDate);
    }

    @ResponseBody
    @RequestMapping("getTmsEegData")
    public Map<String, Object> getTmsEegData(@RequestParam(value = "keyset", required = false) String keyset,
        @RequestParam(value = "startDate", required = false) String startDate,
        @RequestParam(value = "endDate", required = false) String endDate) {
        return tmsEegService.getChartData(keyset, startDate, endDate);
    }

    @ResponseBody
    @RequestMapping("getRTmsData")
    public Map<String, Object> getRTmsData(@RequestParam(value = "keyset", required = false) String keyset,
        @RequestParam(value = "startDate", required = false) String startDate,
        @RequestParam(value = "endDate", required = false) String endDate) {
        return rTmsService.getChartData(keyset, startDate, endDate);
    }

    @ResponseBody
    @RequestMapping("getScaleData")
    public Map<String, Object> getScaleData(@RequestParam(value = "keyset", required = false) String keyset,
        @RequestParam(value = "startDate", required = false) String startDate,
        @RequestParam(value = "endDate", required = false) String endDate) {
        return scaleService.getChartData(keyset, startDate, endDate);
    }

    @ResponseBody
    @RequestMapping("getAllData")
    public Map<String, Object> getAllData(@RequestParam(value = "keyset", required = false) String keyset,
        @RequestParam(value = "page", required = false) int page,
        @RequestParam(value = "rows", required = false) int rows) {
        LocalDateTime beginTime = LocalDateTime.now();
        Map<String, Object> result = new HashMap<>();
        result.put("datas", patientRecordService.getAllData(keyset, page, rows));
        result.put("count", patientRecordService.getAllDataCount(keyset));
        result.put("excuseTime", Duration.between(beginTime,LocalDateTime.now()).toMillis());
        return result;
    }

    @ResponseBody
    @RequestMapping("getDetailByPatientNumber")
    public Map<String, Object> getDetailById(@RequestParam(value = "patientNumber", required = false) String patientNumber,
        @RequestParam(value = "id", required = false) String id) {
        LocalDateTime beginTime = LocalDateTime.now();
        Map<String, Object> result = new HashMap<>();
        result.put("datas", patientRecordService.getDetailByPatientNumber(patientNumber, id));
        result.put("excuseTime", Duration.between(beginTime,LocalDateTime.now()).toMillis());
        return result;
    }

    @ResponseBody
    @RequestMapping("getPatientChartsData")
    public Map<String, Object> getPatientChartsData(@RequestParam(value = "startDate", required = false) String startDate,
        @RequestParam(value = "endDate", required = false) String endDate) {
        return patientRecordService.getPatientChartsData(startDate, endDate);
    }

    @ResponseBody
    @RequestMapping("getPatientGenderChartsData")
    public List<Map<String, Object>> getPatientGenderChartsData() {
        return patientRecordService.getPatientGenderChartsData();
    }

    @ResponseBody
    @RequestMapping("getPatient10InfoData")
    public List<Map<String, Object>> getPatient10InfoData() {
        return patientRecordService.getPatient10InfoData();
    }
}
