package com.eegnet.web.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author ：hurongliang
 * @date ：Created in 2019/4/26 16:24
 * @description：
 * @modified By：
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataTablePagerResult<T> extends ResponseResult {
    private Integer recordsTotal;
    private Integer recordsFiltered;
    private Integer draw;
    private List<T> data;
    private T totalData;
}
