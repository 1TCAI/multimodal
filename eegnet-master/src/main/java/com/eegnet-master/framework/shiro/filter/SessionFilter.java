package com.eegnet.framework.shiro.filter;

import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * @Description
 * @Author sun
 * @Date 2019/5/6 16:32
 * @Version 1.0
 */
public class SessionFilter extends FormAuthenticationFilter {

	@Override
	protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {

		Subject subject = getSubject(request, response);
		if (subject.getPrincipal() == null) {
			Session session = subject.getSession();
			session.setAttribute("timeoutState","timeout");
			WebUtils.issueRedirect(request, response, "/");
			return false;
		}
		return true;
	}
}
