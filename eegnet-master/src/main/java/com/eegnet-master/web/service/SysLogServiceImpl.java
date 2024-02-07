package com.eegnet.web.service.impl;

import com.eegnet.web.dao.SysLogDao;
import com.eegnet.web.entity.SysLog;
import com.eegnet.web.request.SysLogRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.SysLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysLogServiceImpl implements SysLogService {

    @Autowired
    private SysLogDao sysLogDao;

    @Override
    public Integer save(SysLog sysLog) {
        return sysLogDao.save(sysLog);
    }

    @Override
    public DataTablePagerResult<SysLog> getSysLoGList(SysLogRequest request) {
        final String userName = request.getUserName();
        final String startDate = request.getStartDate();
        final String endDate = request.getEndDate();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<SysLog> result = new DataTablePagerResult<>();
        List<SysLog> data = sysLogDao.querySysLogList(page, rows, userName, startDate, endDate);
        int recordCount = sysLogDao.querySysLogListCount(userName, startDate, endDate);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;

    }

}
