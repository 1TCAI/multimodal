package com.eegnet.web.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author wangyujie
 * @date 2018/12/18
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<T> extends ResponseResult {

    private Integer total;
    private Integer records;
    private T userdata;
    private List<T> rows;
}
