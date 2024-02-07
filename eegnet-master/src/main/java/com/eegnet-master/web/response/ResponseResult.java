package com.eegnet.web.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseResult<T> implements Serializable {

	private Integer code;

	private T data;

	private String msg;

	private final long timestamps = System.currentTimeMillis();

	public synchronized static <T> ResponseResult<T> e(ResponseCode statusEnum) {
		return e(statusEnum.code, statusEnum.msg, null);
	}

	public synchronized static <T> ResponseResult<T> e(ResponseCode statusEnum, T data) {
		return e(statusEnum.code, statusEnum.msg, data);
	}

	public synchronized static <T> ResponseResult<T> e(ResponseCode statusEnum, String msg) {
		return e(statusEnum.code, msg, null);
	}

	public synchronized static <T> ResponseResult<T> e(Integer code, String msg, T data) {
		ResponseResult<T> res = new ResponseResult<>();
		res.setCode(code);
		res.setMsg(msg);
		res.setData(data);
		return res;
	}
}
