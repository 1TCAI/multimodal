package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SysUserRequest {
    private String username;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
