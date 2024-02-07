package com.eegnet.framework.context;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * @author baiyu on 19/1/4.
 * @export
 */
@Component
public class AppContext implements ApplicationContextAware {

	private static ApplicationContext context;

	@Override
	public void setApplicationContext(ApplicationContext context) throws BeansException {
		AppContext.context = context;
	}

	public static Object getBean(String id) {
		return context.getBean(id);
	}

	public static <T> T getBean(Class<T> tClass) {
		return context.getBean(tClass);
	}

	public static String getActiveProfile() {
		return context.getEnvironment().getActiveProfiles()[0];
	}
}