package com.eegnet.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * @author sun
 * @date 2019/06/10
 */
@Data
@NoArgsConstructor
public class BannerRequest {
    private Integer type;
    private String title;
    private Integer limit;
    private Integer page;
    private Integer draw;
}
