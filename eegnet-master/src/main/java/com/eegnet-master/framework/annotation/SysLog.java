package com.eegnet.framework.annotation;

import java.lang.annotation.*;

/**
 * @author baiyu on 19/2/1.
 * @export
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SysLog {

	String value();

	ActionType type() default ActionType.SELECT;
}