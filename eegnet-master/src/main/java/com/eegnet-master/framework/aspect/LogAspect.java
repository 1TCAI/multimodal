package com.eegnet.framework.aspect;

import com.alibaba.fastjson.JSON;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

/**
 * 日志拦截器
 * @author baiyu on 18/12/20.
 * @export
 */
@Aspect
@Component
public class LogAspect {

	private final static Logger LOG = LoggerFactory.getLogger(LogAspect.class);

	/**
	 * AOP形式的拦截器 拦截所有controller的方法
	 * @param pjp
	 * @return
	 */
	@Around("execution(* com.eegnet.web.controller.*.*(..)) && !execution(* com.eegnet.web.controller.LoginController.index())")
	public Object log(ProceedingJoinPoint pjp) {
		Throwable ex = null;
		Object result = null;
		long start = System.currentTimeMillis();
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		try {
			result = pjp.proceed();
		} catch (Throwable e) {
			ex = e;
			LOG.error("", ex);
		} finally {
			long end = System.currentTimeMillis();
			if (ex == null) {
				if (LOG.isInfoEnabled()) {
					if (result instanceof ModelAndView) {
						LOG.info("url -> {}, execute -> [{} ms], method -> {}, ip -> {}, args -> {}",
								request.getRequestURL(), (end - start), request.getMethod(), request.getRemoteAddr(), pjp.getArgs());
					} else {
						LOG.info("url -> {}, execute -> [{} ms], method -> {}, ip -> {}, args -> {}, result -> {}",
								request.getRequestURL(), (end - start), request.getMethod(), request.getRemoteAddr(), pjp.getArgs(), JSON.toJSONString(result));
					}
				}
			} else {
				if (LOG.isInfoEnabled()) {
					LOG.error("url -> {}, execute -> [{} ms], method -> {}, ip -> {}, args -> {}, result -> {}",
							request.getRequestURL(), (end - start), request.getMethod(), request.getRemoteAddr(), pjp.getArgs(), JSON.toJSONString(result));
				}
			}
			if (ex != null) {
				throw new RuntimeException(ex);
			}
		}
		return result;
	}

}
