package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Description
 * @Author sun
 * @Date 2019/3/14 11:20
 * @Version 1.0
 */
@Data
@NoArgsConstructor
public class SysRoleUserRequest {

    private Integer roleId;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
