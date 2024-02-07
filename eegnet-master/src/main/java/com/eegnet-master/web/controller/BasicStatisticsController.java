package com.eegnet.web.controller;

import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.entity.BasicStatistics;
import com.eegnet.web.request.BasicStatisticsRequest;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.BasicStatisticsService;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @Description
 * @Author sun
 * @Date 2019/4/23 19:15
 * @Version 1.0
 */
@Controller
@RequestMapping("/chart/")
public class BasicStatisticsController {

    @Autowired
    private BasicStatisticsService basicStatisticsService;

    @RequestMapping("profile")
    @SysLog(value = "查看-概况统计")
    @RequiresPermissions("profile:list")
    public String banner() {
        return "chart/profile/index";
    }

    @ResponseBody
    @RequestMapping("profile/list")
    public PageResult<BasicStatistics> initPage() {
        PageResult<BasicStatistics> result = basicStatisticsService.initChartPage();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("profile/line")
    public PageResult<BasicStatistics> initPage(BasicStatisticsRequest request) {
        if (StringUtils.isNotEmpty(request.getEndDate())) {
            request.setEndDate(request.getEndDate() + " 23:59:59");
        }
        if (StringUtils.isNotEmpty(request.getStartDate())) {
            request.setStartDate(request.getStartDate() + " 00:00:00");
        }
        PageResult<BasicStatistics> result = basicStatisticsService.lineChart(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
}
