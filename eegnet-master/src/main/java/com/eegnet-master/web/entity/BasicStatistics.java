package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Description
 * @Author sun
 * @Date 2019/4/23 16:32
 * @Version 1.0
 */
@Data
@NoArgsConstructor
public class BasicStatistics {

    private Integer userCount;
    private Integer courseCount;
    private Integer videoCount;
    private Integer companyId;
    private String companyName;
    private String createDate;

    private Integer passNumber;//通过总数
    private Integer unPassandpassCount;//通过和未通过总数
    private Integer studyNumber;//学习数
    private Integer couserAndUserNumber;//课程*公司人数
}
