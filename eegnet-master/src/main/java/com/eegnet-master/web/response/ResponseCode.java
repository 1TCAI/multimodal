package com.eegnet.web.response;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
@NoArgsConstructor
@AllArgsConstructor
public enum ResponseCode {

	OK(1,"操作成功"),
	ERROR(0,"系统错误,请联系管理员");

	public Integer code;
	public String msg;

}