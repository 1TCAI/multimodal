package com.eegnet.web.dao;

import com.eegnet.web.entity.BasicStatistics;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @Description
 * @Author sun
 * @Date 2019/4/23 16:54
 * @Version 1.0
 */
public interface BasicStatisticsDao {

    List<BasicStatistics> getUserCount(@Param("startDate") String startDate,
                                       @Param("endDate") String endDate,
                                       @Param("companyId") Integer companyId);

    List<BasicStatistics> getCourseCount(@Param("startDate") String startDate,
                                         @Param("endDate") String endDate,
                                         @Param("companyId") Integer companyId);

    List<BasicStatistics> getVideoCount(@Param("startDate") String startDate,
                                        @Param("endDate") String endDate,
                                        @Param("companyId") Integer companyId);

    List<BasicStatistics> getCompanyUserCount();

    List<BasicStatistics> getStudyAndPassPercent();
}
