package com.eegnet.framework.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * @author baiyu on 18/12/11.
 * @export
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/static/css/**").addResourceLocations("/static/css/");
		registry.addResourceHandler("/static/img/**").addResourceLocations("/static/img/");
		registry.addResourceHandler("/static/js/**").addResourceLocations("/static/js/");
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		// 未登陆则跳转到登陆界面
		registry.addInterceptor(new HandlerInterceptor() {
			@Override
			public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object obj) throws Exception {

				HttpSession session = request.getSession();
				String xSessionId = (String) session.getAttribute("xSessionId");
				if (xSessionId != null) {
					return true;
				}
				response.sendRedirect("/swiper/login");
				return false;
			}
		}).addPathPatterns("/admin/**");

		//已登陆就跳转到管理页面
		registry.addInterceptor(new HandlerInterceptor() {
			@Override
			public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object obj) throws Exception {

				HttpSession session = request.getSession();
				String xSessionId = (String) session.getAttribute("xSessionId");
				if (xSessionId == null) {
					return true;
				}
				response.sendRedirect("/swiper/admin");
				return false;
			}
		}).addPathPatterns("/login/**");
	}
}
