package com.eegnet.web.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author songyubo on 2019/04/17
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddPaperExamsRequest {
    //试卷id
    @NotNull
    private Integer examPaperId;
    //试题id集合
    @NotNull
    private List<Integer> examIdList;
}
