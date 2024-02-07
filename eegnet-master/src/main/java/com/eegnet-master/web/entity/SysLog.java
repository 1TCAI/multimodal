package com.eegnet.web.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SysLog {

    Integer id;
    String userId;
    String userName;
    Integer actionType;
    String actionName;
    String params;
    String clientIp;
    String createDate;
    String updateDate;

}