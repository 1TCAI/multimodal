package com.eegnet.web.dao;


import com.eegnet.web.entity.SysLog;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface SysLogDao {

    Integer save(SysLog sysLog);

    List<SysLog> querySysLogList(@Param("page") Integer page, @Param("rows") Integer rows,
                                 @Param("userName") String userName, @Param("startDate") String startDate,
                                 @Param("endDate") String endDate);

    Integer querySysLogListCount(@Param("userName") String UserName, @Param("startDate") String startDate,
                                 @Param("endDate") String endDate);
}

