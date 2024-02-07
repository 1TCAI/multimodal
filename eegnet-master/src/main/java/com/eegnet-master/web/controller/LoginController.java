package com.eegnet.web.controller;

import com.dingxianginc.ctu.client.CaptchaClient;
import com.dingxianginc.ctu.client.model.CaptchaResponse;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.response.ResponseResult;
import com.eegnet.web.service.SysMenuService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author baiyu on 18/12/11.
 * @export
 */
@Controller
public class LoginController {

	private final static Logger LOG = LoggerFactory.getLogger(LoginController.class);
	@Autowired
	private SysMenuService sysMenuService;
	@Autowired
	private CaptchaClient captchaClient;

	@RequestMapping(value = "/")
	public ModelAndView index() {
		return new ModelAndView("login");
	}

	@SysLog("登陆")
	@ResponseBody
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseResult login(String username, String password, String dxtoken) {
		CaptchaResponse response;
		try {
			response = captchaClient.verifyToken(dxtoken);
		} catch (Exception e) {
			LOG.error("Captcha Exception", e);
			return ResponseResult.e(ResponseCode.ERROR, e.getMessage());
		}
		if (!response.getResult()) {
			return ResponseResult.e(ResponseCode.ERROR, "重新拖动滑块");
		}
		// 1、获取Subject实例对象
		Subject currentUser = SecurityUtils.getSubject();
        // 2、判断当前有人登录
        if (currentUser.isAuthenticated() == true) {
			currentUser.logout();
        }
		// 3、将用户名和密码封装到UsernamePasswordToken
		UsernamePasswordToken token = new UsernamePasswordToken(username, password);
		// 4、认证
		try {
			currentUser.login(token);
			Session session = currentUser.getSession();
			session.setAttribute("userName", username);
			session.setAttribute("menus", sysMenuService.listMenusByUsername(username));
			session.setAttribute("timeoutState","");
			return ResponseResult.e(ResponseCode.OK);
		} catch (UnknownAccountException e) {
			return ResponseResult.e(ResponseCode.ERROR, "账号不存在");
		} catch (IncorrectCredentialsException e) {
			return ResponseResult.e(ResponseCode.ERROR, "密码不正确");
		} catch (AuthenticationException e) {
			return ResponseResult.e(ResponseCode.ERROR, "用户验证失败");
		}
	}

	@RequestMapping("/logout")
	public ModelAndView logout() {
		return new ModelAndView("forward:/");
	}

}