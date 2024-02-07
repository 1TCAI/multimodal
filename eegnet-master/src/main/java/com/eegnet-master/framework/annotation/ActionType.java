package com.eegnet.framework.annotation;

/**
 * @author baiyu on 19/3/20.
 * @export
 */
public enum ActionType {

	SELECT(0),
	ADD(1),
	UPDATE(2),
	DELETE(3);

	private final int value;

	private ActionType(int value) {
		this.value = value;
	}

	public int value() {
		return this.value;
	}
}
