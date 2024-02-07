package com.eegnet.framework.shiro;

import com.eegnet.web.dao.SysMenuDao;
import com.eegnet.web.dao.SysRoleDao;
import com.eegnet.web.dao.SysUserDao;
import com.eegnet.web.entity.SysUser;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;

/**
 * @author baiyu on 18/12/11.
 * @export
 */
public class ShiroRealm extends AuthorizingRealm {

	private final static Logger LOG = LoggerFactory.getLogger(ShiroRealm.class);
	@Autowired
	private SysUserDao sysUserDao;
	@Autowired
	private SysRoleDao sysRoleDao;
	@Autowired
	private SysMenuDao sysMenuDao;

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principal) {
		LOG.info("----> doGetAuthorizationInfo");
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		SysUser sysUser = (SysUser) principal.getPrimaryPrincipal();
		authorizationInfo.addRole(String.valueOf(sysUser.getRoleId()));
		sysMenuDao.listButtonsByRoleId(sysUser.getRoleId()).stream().filter(m ->
			StringUtils.isNoneBlank(m.getPerms())
		).forEach(menu -> {
			authorizationInfo.addStringPermission(menu.getPerms().trim());
		});
		return authorizationInfo;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		//获取用户的输入的账号.
		String username = (String) token.getPrincipal();
		//通过username从数据库中查找 User对象，如果找到，没找到.
		SysUser user = sysUserDao.getByUsername(username);
		LOG.info("----> login auth , doGetAuthenticationInfo, username : {}", username);
		if (Objects.isNull(user)) {
			return null;
		}
		SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo (
				user, //用户
				user.getPassword(), //密码
				ByteSource.Util.bytes(user.getUsername() + user.getSalt()),//salt=username+salt
				getName()  //realm name,
		);
		return authenticationInfo;
	}

	public static void main(String[] args) {
		SimpleHash simpleHash2 = new SimpleHash("MD5", "pandaroot", "root0b418086e144", 1024);
		//输出加密后结果[直接输出对象，或调用toString方法后就是加密结果]
		System.out.println(simpleHash2);
	}
}
