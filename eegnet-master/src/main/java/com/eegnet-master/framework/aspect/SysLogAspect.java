package com.eegnet.framework.aspect;

import com.alibaba.fastjson.JSON;
import com.eegnet.framework.util.Tools;
import com.eegnet.web.entity.SysLog;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.service.SysLogService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Objects;

/**
 * @author baiyu on 19/2/1.
 * @export
 */
@Aspect
@Component
public class SysLogAspect {

	@Autowired
	private SysLogService sysLogService;

	@Pointcut("@annotation(com.eegnet.framework.annotation.SysLog)")
	public void log(){}

	@Before("log()")
	public void after(JoinPoint joinPoint){
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		Subject subject = SecurityUtils.getSubject();
		if(Objects.isNull(subject.getPrincipals())){
			return;
		}
		PrincipalCollection spc = subject.getPrincipals();
		SysUser sysUser = (SysUser) spc.getPrimaryPrincipal();
		SysLog sysLog = new SysLog();
		sysLog.setUserId(sysUser.getUserId());
		sysLog.setUserName(sysUser.getUsername());
		getAction(joinPoint, sysLog);
		sysLog.setClientIp(Tools.getClientIp(attributes.getRequest()));
		sysLog.setParams(JSON.toJSONString(joinPoint.getArgs()));
		sysLogService.save(sysLog);
	}

	private void getAction(JoinPoint joinPoint, SysLog sysLog) {
		Signature signature = joinPoint.getSignature();
		MethodSignature methodSignature = (MethodSignature) signature;
		Method method = methodSignature.getMethod();
		if(method.isAnnotationPresent(com.eegnet.framework.annotation.SysLog.class)){
			com.eegnet.framework.annotation.SysLog sysLogs = method.getAnnotation(com.eegnet.framework.annotation.SysLog.class);
			sysLog.setActionType(sysLogs.type().value());
			sysLog.setActionName(sysLogs.value());
		}
	}
}