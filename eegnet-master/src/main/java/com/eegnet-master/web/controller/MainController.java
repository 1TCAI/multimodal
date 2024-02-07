package com.eegnet.web.controller;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
@Controller
public class MainController {

	@RequestMapping(value = "/main")
	public ModelAndView index() {
		ModelAndView mav = new ModelAndView("login");
		Subject currentUser = SecurityUtils.getSubject();
        if (currentUser.isAuthenticated() == false) {
			return mav;
        }
		mav.setViewName("main");
		return mav;
	}

	@RequestMapping(value = "/403")
	public ModelAndView error403() {
		return new ModelAndView("403");
	}

	@RequestMapping(value = "/kickout")
	public ModelAndView errorKickout() {
		return new ModelAndView("kickout");
	}

}