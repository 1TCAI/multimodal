package com.eegnet.web.controller;

import com.eegnet.web.entity.SysLog;
import com.eegnet.web.request.SysLogRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.SysLogService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/system/")
public class SysLogController {
    @Autowired
    private SysLogService sysLogService;

    @RequestMapping("log")
    public String index() {
        return "system/log/index";
    }


    @RequestMapping("log/selectSysLogList")
    @ResponseBody
    public DataTablePagerResult<SysLog> selectSysLogList(SysLogRequest request) {
        if (StringUtils.isNotEmpty(request.getEndDate())) {
            request.setEndDate(request.getEndDate() + " 23:59:59");
        }
        if (StringUtils.isNotEmpty(request.getEndDate())) {
            request.setStartDate(request.getStartDate() + " 00:00:00");
        }
        DataTablePagerResult<SysLog> result = sysLogService.getSysLoGList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

}
