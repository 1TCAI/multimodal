package com.pandabus.web.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @Description
 * @Author sun
 * @Date 2019/3/14 18:28
 * @Version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysRoleMenu implements Serializable {

    private Integer roleId;
    private Integer menuId;
    private Integer parentId;//权限父ID

    private String isparent;

}
