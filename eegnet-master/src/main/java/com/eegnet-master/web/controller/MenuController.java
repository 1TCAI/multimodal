package com.eegnet.web.controller;

import com.eegnet.web.service.SysMenuService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
@Controller
@RequestMapping(value = "/menu")
public class MenuController {

	@Autowired
	private SysMenuService sysMenuService;

	@RequestMapping(value = "/tree")
	private ModelAndView menuTree() {
		ModelAndView mav = new ModelAndView("menus");
		Subject currentUser = SecurityUtils.getSubject();

		Session session = currentUser.getSession();
		String userName = (String) session.getAttribute("userName");

		mav.addObject("menus", session.getAttribute("menu"));
		return mav;
	}

}
