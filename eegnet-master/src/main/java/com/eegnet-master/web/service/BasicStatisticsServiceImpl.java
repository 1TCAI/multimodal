package com.eegnet.web.service.impl;

import com.panda.utils.DateTimeUtils;
import com.eegnet.web.dao.BasicStatisticsDao;
import com.eegnet.web.entity.BasicStatistics;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.request.BasicStatisticsRequest;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.service.BasicStatisticsService;
import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @Description
 * @Author sun
 * @Date 2019/4/23 18:30
 * @Version 1.0
 */
@Service
public class BasicStatisticsServiceImpl implements BasicStatisticsService {

    @Autowired
    private BasicStatisticsDao basicStatisticsDao;

    @Override
    public PageResult<BasicStatistics> initChartPage() {

        DateTimeFormatter formatter =  DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        DateTimeFormatter formatterDate =  DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDateTime end = LocalDateTime.parse(DateTimeUtils.nowDate() + " 23:59:59", formatter);
        String endDateStr =  formatter.format(end);
        LocalDateTime start = LocalDateTime.parse(DateTimeUtils.nowDate() + " 00:00:00", formatter).minusDays(6);
        String startDateStr =  formatter.format(start);

        PageResult<BasicStatistics> pageResult = new PageResult<>();

        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();

        List<BasicStatistics> userCount = basicStatisticsDao.getUserCount(startDateStr, endDateStr, sysUser.getCompanyId());
        List<BasicStatistics> courseCount = basicStatisticsDao.getCourseCount(startDateStr, endDateStr, sysUser.getCompanyId());
        List<BasicStatistics> videoCount = basicStatisticsDao.getVideoCount(startDateStr, endDateStr, sysUser.getCompanyId());
        List<BasicStatistics> companyUserCount = basicStatisticsDao.getCompanyUserCount();
        List<BasicStatistics> studyAndPassPercent = basicStatisticsDao.getStudyAndPassPercent();

        int allUserCount = companyUserCount.stream().mapToInt(BasicStatistics::getUserCount).sum();

        Map<String, BasicStatistics> userCountMap = userCount.stream()
                .collect(Collectors.toMap(BasicStatistics::getCreateDate, Function.identity(), (key1, key2) -> key2));
        Map<String, BasicStatistics> courseCountMap = courseCount.stream()
                .collect(Collectors.toMap(BasicStatistics::getCreateDate, Function.identity(), (key1, key2) -> key2));
        Map<String, BasicStatistics> videoCountMap = videoCount.stream()
                .collect(Collectors.toMap(BasicStatistics::getCreateDate, Function.identity(), (key1, key2) -> key2));

        List<BasicStatistics> lineList = new ArrayList<>();

        Integer userTemp = 0;
        Integer couseTemp = 0;
        int i = 0;
        while (start.isBefore(end)) {

            String time = formatterDate.format(start);
            BasicStatistics basicStatistics = new BasicStatistics();
            if (i == 0) {
                if (!userCountMap.containsKey(time)) {
                    if (!CollectionUtils.isEmpty(userCount)){
                        for (int j = 0; j < userCount.size(); j++) {
                            if (start.isAfter(LocalDateTime.parse(userCount.get(j).getCreateDate() + " 00:00:00", formatter))) {
                                if (j == userCount.size()-1) {
                                    userCountMap.put(time, userCount.get(j));
                                }
                                continue;
                            } else {
                                if (j == 0) {
                                    break;
                                }
                                userCountMap.put(time, userCount.get(j-1));
                                break;
                            }
                        }
                    }
                }

                if (!courseCountMap.containsKey(time)) {
                    if (!CollectionUtils.isEmpty(courseCount)) {
                        for (int j = 0; j < courseCount.size(); j++) {
                            if (start.isAfter(LocalDateTime.parse(courseCount.get(j).getCreateDate() + " 00:00:00", formatter))) {
                                if (j == courseCount.size()-1) {
                                    courseCountMap.put(time, courseCount.get(j));
                                }
                                continue;
                            } else {
                                if (j == 0) {
                                    break;
                                }
                                courseCountMap.put(time, courseCount.get(j-1));
                                break;
                            }
                        }
                    }
                }
            }
            if (userCountMap.containsKey(time)) {
                basicStatistics.setUserCount(userCountMap.get(time).getUserCount());
                userTemp =userCountMap.get(time).getUserCount();
            } else {
                basicStatistics.setUserCount(userTemp);
            }
            if (courseCountMap.containsKey(time)) {
                basicStatistics.setCourseCount(courseCountMap.get(time).getCourseCount());
                couseTemp = courseCountMap.get(time).getCourseCount();
            } else {
                basicStatistics.setCourseCount(couseTemp);
            }
            if (videoCountMap.containsKey(time)) {
                basicStatistics.setVideoCount(videoCountMap.get(time).getVideoCount());
            } else {
                basicStatistics.setVideoCount(0);
            }
            basicStatistics.setCreateDate(time);
            lineList.add(basicStatistics);
            start = start.plusDays(1);
            i++;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("lineList",lineList);
        map.put("companyUserCount",companyUserCount);
        map.put("studyAndPassPercent",studyAndPassPercent);
        map.put("allUserCount",allUserCount);
        pageResult.setData(map);
        return pageResult;
    }

    @Override
    public PageResult<BasicStatistics> lineChart(BasicStatisticsRequest request) {
        DateTimeFormatter formatterDate =  DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter formatter =  DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        final String startDateStr = request.getStartDate();
        final String endDateStr = request.getEndDate();
        LocalDateTime end = LocalDateTime.parse(endDateStr, formatter);
        LocalDateTime start = LocalDateTime.parse(startDateStr, formatter);

        PageResult<BasicStatistics> pageResult = new PageResult<>();

        Subject subject = SecurityUtils.getSubject();
        PrincipalCollection spc = subject.getPrincipals();
        SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();

        List<BasicStatistics> userCount = basicStatisticsDao.getUserCount(startDateStr, endDateStr, sysUser.getCompanyId());
        List<BasicStatistics> courseCount = basicStatisticsDao.getCourseCount(startDateStr, endDateStr, sysUser.getCompanyId());
        List<BasicStatistics> videoCount = basicStatisticsDao.getVideoCount(startDateStr, endDateStr, sysUser.getCompanyId());

        Map<String, BasicStatistics> userCountMap = userCount.stream()
                .collect(Collectors.toMap(BasicStatistics::getCreateDate, Function.identity(), (key1, key2) -> key2));
        Map<String, BasicStatistics> courseCountMap = courseCount.stream()
                .collect(Collectors.toMap(BasicStatistics::getCreateDate, Function.identity(), (key1, key2) -> key2));
        Map<String, BasicStatistics> videoCountMap = videoCount.stream()
                .collect(Collectors.toMap(BasicStatistics::getCreateDate, Function.identity(), (key1, key2) -> key2));

        List<BasicStatistics> lineList = new ArrayList<>();

        Integer userTemp = 0;
        Integer couseTemp = 0;
        int i = 0;
        while (start.isBefore(end)) {

            String time = formatterDate.format(start);
            BasicStatistics basicStatistics = new BasicStatistics();
            if (i == 0) {
                if (!userCountMap.containsKey(time)) {
                    if (!CollectionUtils.isEmpty(userCount)){
                        for (int j = 0; j < userCount.size(); j++) {
                            if (start.isAfter(LocalDateTime.parse(userCount.get(j).getCreateDate() + " 00:00:00", formatter))) {
                                if (j == userCount.size()-1) {
                                    userCountMap.put(time, userCount.get(j));
                                }
                                continue;
                            } else {
                                if (j == 0) {
                                    break;
                                }
                                userCountMap.put(time, userCount.get(j-1));
                                break;
                            }
                        }
                    }
                }

                if (!courseCountMap.containsKey(time)) {
                    if (!CollectionUtils.isEmpty(courseCount)) {
                        for (int j = 0; j < courseCount.size(); j++) {
                            if (start.isAfter(LocalDateTime.parse(courseCount.get(j).getCreateDate() + " 00:00:00", formatter))) {
                                if (j == courseCount.size()-1) {
                                    courseCountMap.put(time, courseCount.get(j));
                                }
                                continue;
                            } else {
                                if (j == 0) {
                                    break;
                                }
                                courseCountMap.put(time, courseCount.get(j-1));
                                break;
                            }
                        }
                    }
                }
            }

            if (userCountMap.containsKey(time)) {
                basicStatistics.setUserCount(userCountMap.get(time).getUserCount());
                userTemp = userCountMap.get(time).getUserCount();
            } else {
                basicStatistics.setUserCount(userTemp);
            }
            if (courseCountMap.containsKey(time)) {
                basicStatistics.setCourseCount(courseCountMap.get(time).getCourseCount());
                couseTemp = courseCountMap.get(time).getCourseCount();
            } else {
                basicStatistics.setCourseCount(couseTemp);
            }
            if (videoCountMap.containsKey(time)) {
                basicStatistics.setVideoCount(videoCountMap.get(time).getVideoCount());
            } else {
                basicStatistics.setVideoCount(0);
            }
            basicStatistics.setCreateDate(time);
            lineList.add(basicStatistics);
            start = start.plusDays(1);
            i++;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("lineList",lineList);
        pageResult.setData(map);
        return pageResult;
    }
}
