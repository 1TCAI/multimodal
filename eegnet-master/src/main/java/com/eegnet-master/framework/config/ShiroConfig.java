package com.eegnet.framework.config;

import at.pollux.thymeleaf.shiro.dialect.ShiroDialect;
import com.eegnet.framework.shiro.ShiroRealm;
import com.eegnet.framework.shiro.filter.SessionFilter;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.codec.Base64;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.CookieRememberMeManager;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.crazycake.shiro.RedisCacheManager;
import org.crazycake.shiro.RedisManager;
import org.crazycake.shiro.RedisSessionDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.Filter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author baiyu on 18/12/11.
 * @export
 */
@Configuration
public class ShiroConfig {

	private final static Logger LOG = LoggerFactory.getLogger(ShiroConfig.class);

	@Bean
	public ShiroRedisConfig shiroRedisConfig() {
		return new ShiroRedisConfig();
	}

	/**
	* crazycake 实现 redisManager
	* @return
	*/
	@Bean
	public RedisManager redisManager() {
		RedisManager redisManager = new RedisManager();
		redisManager.setHost(shiroRedisConfig().getHost());
		redisManager.setPassword(shiroRedisConfig().getPassword());
		redisManager.setTimeout(shiroRedisConfig().getTimeout());
		redisManager.setDatabase(shiroRedisConfig().getDatabase());
		return redisManager;
	}

	/**
	 * crazycake 实现 sessionDao
	 * @return
	 */
	@Bean
	public RedisSessionDAO sessionDao(){
		RedisSessionDAO sessionDAO = new RedisSessionDAO();
		sessionDAO.setRedisManager(redisManager());
		return sessionDAO;
	}

	/**
	 * crazycake 实现 redisCacheManager
	 * @return
	 */
	@Bean
	public RedisCacheManager redisCacheManager(){
		RedisCacheManager cacheManager = new RedisCacheManager();
		cacheManager.setRedisManager(redisManager());
		cacheManager.setPrincipalIdFieldName("userId");
		return cacheManager;
	}

	/**
	 * 	ShiroFilterFactoryBean 处理拦截资源文件过滤器
	 *  </br>1,配置shiro安全管理器接口securityManage;
	 *  </br>2,shiro 连接约束配置filterChainDefinitions;
	 */
	@Bean
	public ShiroFilterFactoryBean shirFilter() {
		//	shiroFilterFactoryBean对象
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();

		//	配置shiro安全管理器 SecurityManager
		shiroFilterFactoryBean.setSecurityManager(securityManager());
		//	指定要求登录时的链接
		shiroFilterFactoryBean.setLoginUrl("/");
		//	登录成功后要跳转的链接
		shiroFilterFactoryBean.setSuccessUrl("/main");
		//	未授权时跳转的界面，需与下面的SimpleMappingExceptionResolver一起配合使用
		shiroFilterFactoryBean.setUnauthorizedUrl("/403");
		//	添加kickout认证
//		HashMap<String, Filter> hashMap=new HashMap<>();
//		hashMap.put("kickout", kickoutSessionControlFilter());
//		shiroFilterFactoryBean.setFilters(hashMap);
		Map<String, Filter> hashMap = new HashMap<>();//获取filters
		hashMap.put("authc", new SessionFilter());//将自定义 的FormAuthenticationFilter注入shiroFilter中
		shiroFilterFactoryBean.setFilters(hashMap);
		//	filterChainDefinitions拦截器
		Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
		//	配置不会被拦截的链接 从上向下顺序判断
//		filterChainDefinitionMap.put("/static/**", "anon");
		filterChainDefinitionMap.put("/inspinia/**", "anon");
		filterChainDefinitionMap.put("/img/**", "anon");
		filterChainDefinitionMap.put("/js/**", "anon");
		filterChainDefinitionMap.put("/favicon.ico", "anon");
		filterChainDefinitionMap.put("/403", "anon");
		//	配置退出过滤器,具体的退出代码Shiro已经替我们实现了
		filterChainDefinitionMap.put("/logout", "anon");
		filterChainDefinitionMap.put("/video/videoInfo/subscription", "anon");
		filterChainDefinitionMap.put("/course/courseVideo/subscription", "anon");
		filterChainDefinitionMap.put("/login", "anon");
		filterChainDefinitionMap.put("/kickout", "anon");
		filterChainDefinitionMap.put("/", "anon");

		// 	<!-- authc:所有url都必须认证通过才可以访问; anon:所有url都都可以匿名访问【放行】-->
		filterChainDefinitionMap.put("/**", "authc");
		filterChainDefinitionMap.put("/system/**", "authc");
//		filterChainDefinitionMap.put("/forms/**", "authc");
//		filterChainDefinitionMap.put("/wallet/**", "authc");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		return shiroFilterFactoryBean;
	}

	/**
	 * 凭证匹配器
	 * （由于我们的密码校验交给Shiro的SimpleAuthenticationInfo进行处理了）
	 * @return
	 */
	@Bean
	public HashedCredentialsMatcher hashedCredentialsMatcher() {
		HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
		hashedCredentialsMatcher.setHashAlgorithmName("MD5");//散列算法:这里使用MD5算法;
		hashedCredentialsMatcher.setHashIterations(1024);	 //散列的次数，比如散列两次，相当于 md5(md5(""));
		return hashedCredentialsMatcher;
	}

	/**
	 *  开启shiro aop注解支持.
	 *  使用代理方式;所以需要开启代码支持;
	 * @param securityManager
	 * @return
	 */
	@Bean
	public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(org.apache.shiro.mgt.SecurityManager securityManager){
		AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
		authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
		return authorizationAttributeSourceAdvisor;
	}

	/**
	 * 身份认证realm;
	 * (账号密码校验；权限等)
	 * 自己实现
	 * @return
	 */
	@Bean
	public ShiroRealm shiroRealm() {
		ShiroRealm shiroRealm = new ShiroRealm();
		shiroRealm.setCredentialsMatcher(hashedCredentialsMatcher());
		return shiroRealm;
	}

	/**
	 * 未授权跳转页面
	 * @return
	 */
//	@Bean
//	public SimpleMappingExceptionResolver resolver() {
//		SimpleMappingExceptionResolver resolver = new SimpleMappingExceptionResolver();
//		Properties properties = new Properties();
//		properties.setProperty("org.apache.shiro.authz.UnauthorizedException", "/403");
//		resolver.setExceptionMappings(properties);
//		return resolver;
//	}

	/**
	 * shiro安全管理器设置realm认证
	 * @return
	 */
	@Bean
	public DefaultWebSecurityManager securityManager() {
		DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
		// 配置 rememberMeCookie 查看源码可以知道，这里的rememberMeManager就仅仅是一个赋值，所以先执行
//   		securityManager.setRememberMeManager(rememberMeManager());
		// 配置 缓存管理类 cacheManager，这个cacheManager必须要在前面执行，因为setRealm 和 setSessionManage都有方法初始化了cachemanager,看下源码就知道了
    	securityManager.setCacheManager(redisCacheManager());
		// 设置realm.
		securityManager.setRealm(shiroRealm());
		// 配置 sessionManager
    	securityManager.setSessionManager(sessionManager());
		return securityManager;
	}

	/**
	  * session 管理对象
	  *
	  * @return DefaultWebSessionManager
	  */
	@Bean
	public DefaultWebSessionManager sessionManager() {
		DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
		// 设置session超时时间，单位为毫秒
		sessionManager.setGlobalSessionTimeout(shiroRedisConfig().getSessionTimeout());
		// 删除无效session
		sessionManager.setDeleteInvalidSessions(true);
		sessionManager.setSessionIdCookie(new SimpleCookie("JSESSIONID"));
		sessionManager.setSessionDAO(sessionDao());
		return sessionManager;
	}


	 /**
	  * cookie管理对象
	  *
	  * @return CookieRememberMeManager
	  */
	 @Bean
	 public CookieRememberMeManager rememberMeManager() {
		CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
		cookieRememberMeManager.setCookie(rememberMeCookie());
		// rememberMe cookie 加密的密钥
		cookieRememberMeManager.setCipherKey(Base64.decode("ZWvohmPdUsAWT3=KpPqda"));
		return cookieRememberMeManager;
	 }

	 /**
	  * rememberMe cookie 效果是重开浏览器后无需重新登录
	  * @return SimpleCookie
	  */
	 @Bean
	 public SimpleCookie rememberMeCookie() {
		// 这里的Cookie的默认名称是 CookieRememberMeManager.DEFAULT_REMEMBER_ME_COOKIE_NAME
		SimpleCookie cookie = new SimpleCookie(CookieRememberMeManager.DEFAULT_REMEMBER_ME_COOKIE_NAME);
		// 是否只在https情况下传输
		cookie.setSecure(false);
		// 设置 cookie 的过期时间，单位为秒，这里为30天
		cookie.setMaxAge(shiroRedisConfig().getMaxAge());
		return cookie;
	 }

	/**
	 * 限制同一账号登录同时登录人数控制
	 * @return 过滤器
	 */
//	@Bean
//	public KickoutSessionControlFilter kickoutSessionControlFilter() {
//		KickoutSessionControlFilter kickoutSessionControlFilter = new KickoutSessionControlFilter();
//		//使用cacheManager获取相应的cache来缓存用户登录的会话；用于保存用户—会话之间的关系的；
//		//这里我们还是用之前shiro使用的redisManager()实现的cacheManager()缓存管理
//		//也可以重新另写一个，重新配置缓存时间之类的自定义缓存属性
//		kickoutSessionControlFilter.setCacheManager(redisCacheManager());
//		//用于根据会话ID，获取会话进行踢出操作的；
//		kickoutSessionControlFilter.setSessionManager(sessionManager());
//		//是否踢出后来登录的，默认是false；即后者登录的用户踢出前者登录的用户；踢出顺序。
//		kickoutSessionControlFilter.setKickoutAfter(false);
//		//同一个用户最大的会话数，默认1；比如2的意思是同一个用户允许最多同时两个人登录；
//		kickoutSessionControlFilter.setMaxSession(1);
//		//被踢出后重定向到的地址；
//		kickoutSessionControlFilter.setKickoutUrl("/kickout");
//		return kickoutSessionControlFilter;
//	}

	/**
	 * thymeleaf模板使用shiro标签
	 * @return
	 */
	@Bean
	public ShiroDialect shiroDialect() {
		return new ShiroDialect();
	}

}
