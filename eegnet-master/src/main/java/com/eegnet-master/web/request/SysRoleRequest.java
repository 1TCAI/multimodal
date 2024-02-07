package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SysRoleRequest {
    private String roleName;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
